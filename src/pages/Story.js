import React, { useEffect, useState } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { apiURL } from '../config.json'

import Navigation from '../components/Navigation'
import Comments from '../components/Comments'
import Timeline from '../components/Timeline'
import Button from '../components/Button'

const Story = (props) => {
  const { storyId } = props

  const userId = localStorage.getItem('id')

  const [story, setStory] = useState('')

  const [editDescription, setDescription] = useState('')

  const [editMode, setEditMode] = useState(false)

  const [editor, setEditor] = useState(false)

  useEffect(() => {
    const fetchStory = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          featureRequest(id: "${storyId}") {
            Title
            Description
            feature_requests_status {
              Status
            }
            user {
              username
            }
            Votes
            feature_request_comments {
              Comments
              user {
                username
              }
              createdAt
            }
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setStory(response.data.data.featureRequest)
    }
    fetchStory()
    const editStory = async () => {
      const check = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          user(id: "${userId}") {
            feature_requests {
              id
            }
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      if (
        check.data.data.user.feature_requests.filter(
          (story) => story.id === storyId
        ).length
      ) {
        setEditMode(true)
      }
    }
    if (userId) {
      editStory()
    }
  }, [storyId, userId])

  const save = async (event) => {
    event.preventDefault()
    await axios.post(
      `${apiURL}/graphql`,
      {
        query: `mutation {
        updateFeatureRequest(
          input: { where: { id: "${storyId}" }, data: { Description: "${
          story.Description + editDescription
        }" } }
        ) {
          featureRequest {
            Description
            updatedAt
          }
        }
      }
      `
      },
      {
        withCredentials: true
      }
    )
    setEditor(false)
    setStory({
      ...story,
      Description: `${story.Description + editDescription}`
    })
  }

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          {story ? (
            <>
              <Timeline status={story.feature_requests_status.Status} />
              <div className='story-content'>
                <div className='icon-display'>
                  {story.Votes}
                  <i className='eos-icons'>thumb_up</i>
                </div>
                <h3>{story.Title}</h3>
                {editor ? (
                  <>
                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        toolbar: [
                          'heading',
                          '|',
                          'bold',
                          'italic',
                          '|',
                          'link',
                          'bulletedList',
                          'numberedList'
                        ]
                      }}
                      onChange={(event, editor) => {
                        const response = editor.getData()
                        setDescription(response)
                      }}
                    />
                    <Button className='btn btn-default' onClick={save}>
                      Save
                    </Button>
                  </>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: story.Description }}
                  />
                )}
                {editMode && !editor && (
                  <Button
                    className='btn btn-default'
                    onClick={() => setEditor(true)}
                  >
                    Edit
                  </Button>
                )}
                {editMode && editor && (
                  <Button
                    className='btn btn-default'
                    onClick={() => setEditor(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              <Comments comments={story.feature_request_comments} />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

export default Story

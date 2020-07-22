import React, { useEffect, useState } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import Comments from '../components/Comments'
import Timeline from '../components/Timeline'
import Button from '../components/Button'
import LoadingIndicator from '../modules/LoadingIndicator'
import Navigation from '../components/Navigation'

const Story = (props) => {
  const { storyId } = props

  const userId = localStorage.getItem('id')

  const [story, setStory] = useState('')

  const [editDescription, setDescription] = useState('')

  const [editMode, setEditMode] = useState(false)

  const [editor, setEditor] = useState(false)

  const [voted, setVoted] = useState(false)

  const [votes, setVotes] = useState(0)

  const [followers, setFollowers] = useState([])
  const { promiseInProgress } = usePromiseTracker()

  useEffect(() => {
    const fetchStory = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStory(id: "${storyId}") {
              Title
              Description
              user_story_status {
                Status
              }
              user_story_comments {
                Comments
                user {
                  username
                }
                createdAt
              }
              author {
                username
              }
              followers {
                id
              }
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setStory(response.data.data.userStory)
      setVotes(response.data.data.userStory.followers.length)
      const followerIds = response.data.data.userStory.followers.map((item) =>
        JSON.stringify(item.id)
      )
      setFollowers(followerIds)
    }
    trackPromise(fetchStory())
    const editStory = async () => {
      const check = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStories(where: {
              author: {id: "${userId}"}
            }) {
              id
            }
          }
          `
        },
        {
          withCredentials: true
        }
      )

      if (check.data.data.userStories.filter((id) => id === storyId)) {
        setEditMode(true)
      }
    }
    if (userId) {
      trackPromise(editStory())
    }
  }, [storyId, userId])

  const save = async (event) => {
    event.preventDefault()
    await axios.post(
      `${apiURL}/graphql`,
      {
        query: `mutation {
          updateUserStory(
            input: { where: { id: "${storyId}" }, data: { Description: "${
          story.Description + editDescription
        }" } }
          ) {
            userStory {
              updatedAt
            }
          }
        }`
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

  const updateVote = async (event) => {
    event.preventDefault()
    if (voted) {
      setVotes((votes) => votes - 1)
      followers.pop()
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
        mutation {
          updateUserStory(input: {where: {id: "${storyId}"} data: {followers: [${followers}]}}){
            userStory{
              followers {
                id
              }
            }
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      const followerIds = response.data.data.updateUserStory.userStory.followers.map(
        (item) => JSON.stringify(item.id)
      )
      setFollowers(followerIds)
    } else {
      setVotes((votes) => votes + 1)
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
        mutation {
          updateUserStory(input: {where: {id: "${storyId}"} data: {followers: [${followers}, "${userId}"]}}){
            userStory{
              followers {
                id
              }
            }
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      const followerIds = response.data.data.updateUserStory.userStory.followers.map(
        (item) => JSON.stringify(item.id)
      )
      setFollowers(followerIds)
    }
    setVoted((voted) => !voted)
  }

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : story ? (
            <>
              <Timeline status={story.user_story_status.Status} />
              <div className='story-content'>
                <div className='icon-display'>
                  {votes}
                  <Button onClick={updateVote}>
                    <i className='eos-icons'>thumb_up</i>
                  </Button>
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
              <Comments comments={story.user_story_comments} />
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

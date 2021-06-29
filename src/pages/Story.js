import React, { useEffect, useState } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share'

import { Helmet } from 'react-helmet'

import Comments from '../components/Comments'
import Timeline from '../components/Timeline'
import Button from '../components/Button'
import LoadingIndicator from '../modules/LoadingIndicator'
import Navigation from '../components/Navigation'
import { Link, navigate } from '@reach/router'
import Vote from '../components/Vote'
import Modal from '../components/Modal'

const Story = (props) => {
  const { storyId } = props

  const userId = localStorage.getItem('id')

  const [story, setStory] = useState('')

  const [editDescription, setDescription] = useState('')

  const [editMode, setEditMode] = useState(false)

  const [editor, setEditor] = useState(false)

  const { promiseInProgress } = usePromiseTracker()

  const [isOpen, setIsOpen] = useState(false)

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchStory = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStory(id: "${storyId}") {
              id
              Title
              Description
              user_story_status {
                Status
              }
              author {
                id
                username
              }
              followers {
                id
                username
              }
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setStory(response.data.data.userStory)
    }
    trackPromise(fetchStory())
    const editStory = async () => {
      const check = await axios.post(
        `${apiURL}/checkAuthor`,
        {
          id: userId,
          storyId: storyId
        },
        {
          withCredentials: true
        }
      )
      if (check.data) {
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

  if (story === null) {
    navigate('/404', { replace: true })
    return null
  }

  const copy = () => {
    const dummy = document.createElement('input')
    const text = window.location.href

    document.body.appendChild(dummy)
    dummy.value = text
    dummy.select()
    document.execCommand('copy')
    document.body.removeChild(dummy)
  }

  const hashtagsArray = ['EOS', 'userstory']
  const title = 'EOS User Story - POST Stories. GET Features.'

  return (
    <>
      <Helmet>
        <title>{`${story.Title} | EOS User story`}</title>
        <meta name='description' content={`${story.Description}`} />
        <meta name='keywords' content='user story, issue tracker' />
      </Helmet>
      <Navigation />
      {promiseInProgress ? (
        <LoadingIndicator />
      ) : story ? (
        <>
          <div className='body-content'>
            <div className='body-wrapper'>
              <Timeline currentStatus={story.user_story_status.Status} />
              <div className='story-heading'>
                <h3>{story.Title}</h3>
                <div className='flex flex-row flex-space-between'>
                  <Vote story={story} />
                  <div className='author-information'>
                    <h4>
                      By:{' '}
                      <Link
                        className='link link-default'
                        to={`/profile/${story.author.id}`}
                      >
                        {story.author.username}
                      </Link>
                    </h4>
                    <div className='user-avatar'>
                      <img
                        className='avatar'
                        src={`https://avatars.dicebear.com/api/jdenticon/${story.author.username}.svg`}
                        alt='Default User Avatar'
                      ></img>
                    </div>
                  </div>
                </div>
              </div>

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
                </>
              ) : (
                <div
                  className='story-description'
                  dangerouslySetInnerHTML={{ __html: story.Description }}
                />
              )}
              <div className='story-buttons-container'>
                {editMode && !editor ? (
                  <>
                    <Button
                      className='btn btn-default'
                      onClick={() => setEditor(true)}
                    >
                      Edit
                    </Button>
                    <Button className='share-story' onClick={togglePopup}>
                      <i className='eos-icons'> share </i>
                    </Button>
                    <Button className='share-story' onClick={copy}>
                      <i className='eos-icons'>content_copy</i>
                    </Button>
                  </>
                ) : (
                  ''
                )}
                {editor ? (
                  <Button className='btn btn-default' onClick={save}>
                    Save
                  </Button>
                ) : (
                  ''
                )}
                {editor ? (
                  <Button
                    className='btn btn-default'
                    onClick={() => setEditor(false)}
                  >
                    Cancel
                  </Button>
                ) : (
                  ''
                )}
                {isOpen && (
                  <Modal
                    content={
                      <>
                        <h1>Share</h1>
                        <FacebookShareButton
                          url={window.location}
                          className='share-button'
                          quote={title}
                          hashtag={'#EOS'}
                          onShareWindowClose={togglePopup}
                        >
                          <FacebookIcon />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={window.location}
                          className='share-button'
                          title={title}
                          hashtags={hashtagsArray}
                          onShareWindowClose={togglePopup}
                        >
                          <TwitterIcon />
                        </TwitterShareButton>
                        <LinkedinShareButton
                          url={window.location}
                          className='share-button'
                          onShareWindowClose={togglePopup}
                        >
                          <LinkedinIcon />
                        </LinkedinShareButton>
                        <WhatsappShareButton
                          url={window.location}
                          className='share-button'
                          title={title}
                          separator=' '
                          onShareWindowClose={togglePopup}
                        >
                          <WhatsappIcon />
                        </WhatsappShareButton>
                      </>
                    }
                    handleClose={togglePopup}
                    active={isOpen}
                  />
                )}
              </div>
              <Comments storyId={storyId} />
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default Story

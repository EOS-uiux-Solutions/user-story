import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import {
  TwitterShareButton,
  LinkedinShareButton,
  TwitterIcon,
  LinkedinIcon
} from 'react-share'
import Gallery from '../components/ImageGallery'
import StoryPageTimeline from '../components/StoryPageTimeline'
import ShowMore from '../components/ShowMore'

import { Helmet } from 'react-helmet'

import MarkdownEditor from '../components/MarkdownEditor'
import { filterDescriptionText } from '../utils/filterText'
import Comments from '../components/Comments'
import Button from '../components/Button'
import LoadingIndicator from '../modules/LoadingIndicator'
import Navigation from '../components/Navigation'
import { Link, navigate } from '@reach/router'
import Modal from '../components/Modal'
import userStory from '../services/user_story'

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
      const response = await userStory.getStory(storyId)
      setStory(response.data.data.userStory)
    }
    trackPromise(fetchStory())
    const editStory = async () => {
      const check = await userStory.checkAuthor(userId, storyId)
      if (check.data) {
        setEditMode(true)
      }
    }
    if (userId) {
      editStory()
    }
  }, [storyId, userId])

  const save = async (event) => {
    if (editDescription.length <= 0) {
      return
    }
    event.preventDefault()
    const combinedDescription = story.Description + editDescription
    const filteredDescription = filterDescriptionText(combinedDescription)
    await userStory.updateUserStoryDescription(storyId, filteredDescription)
    setEditor(false)
    setStory({
      ...story,
      Description: `${combinedDescription}`
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
        <title>EOS User story</title>
        <meta
          name='description'
          content="Share with us how you use our products, relate to other users stories, vote them up, and we'll make sure we deliver cohesive solutions that enhance your experience."
        />
        <meta name='keywords' content='user story, issue tracker' />
      </Helmet>
      <Navigation />
      {promiseInProgress ? (
        <LoadingIndicator />
      ) : story ? (
        <>
          <div
            className={
              story.user_story_comments.length !== 0 || editor
                ? 'body-content story-page-second'
                : 'body-content story-page'
            }
          >
            <div className='body-wrapper'>
              <div className='story-heading flex flex-row'>
                <svg
                  className='story-title-pattern'
                  width='41'
                  height='41'
                  viewBox='0 0 41 41'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    id='Ellipse 1'
                    cx='20.5'
                    cy='20.5'
                    r='12'
                    fill='#42779B'
                  />
                </svg>
                <h2>{story.Title}</h2>
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
                  <div className='story-buttons-container-top'>
                    {editMode && !editor ? (
                      <>
                        <Button
                          className='btn btn-default'
                          data-cy='btn-edit'
                          onClick={() => setEditor(true)}
                        >
                          Edit
                        </Button>
                      </>
                    ) : (
                      ''
                    )}
                    {
                      <>
                        <Button className='share-story' onClick={togglePopup}>
                          <i className='eos-icons'> share </i>
                        </Button>
                        <Button className='share-story' onClick={copy}>
                          <i className='eos-icons'>content_copy</i>
                        </Button>
                      </>
                    }
                  </div>
                </div>
              </div>

              <div className='flex flex-row'>
                {editor ? (
                  <div data-cy='edit-description' className='story-editor'>
                    <MarkdownEditor
                      callback={(html) => {
                        setDescription(html)
                      }}
                    />
                  </div>
                ) : (
                  <div className='flex flex-row'>
                    {!!story.Attachment.length && (
                      <div className='gallery-container flex-column'>
                        <Gallery imageArray={story.Attachment} />
                      </div>
                    )}
                    <ShowMore
                      maxCharacterLimit={350}
                      txt={story.Description}
                      textLength={story.Description.length}
                    />
                  </div>
                )}
                <div className='right-nav'>
                  <StoryPageTimeline
                    story={story}
                    currentStatus={story.user_story_status.Status}
                  />
                </div>
              </div>
              <div className='story-buttons-container-bottom'>
                {editor ? (
                  <Button
                    className='btn btn-default btn-bottom'
                    onClick={save}
                    data-cy='btn-save'
                  >
                    Save
                  </Button>
                ) : (
                  ''
                )}
                {editor ? (
                  <Button
                    className='btn btn-default btn-bottom'
                    onClick={() => setEditor(false)}
                  >
                    Cancel
                  </Button>
                ) : (
                  ''
                )}
              </div>
              {isOpen && (
                <Modal
                  content={
                    <>
                      <h1>Share</h1>
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
                    </>
                  }
                  handleClose={togglePopup}
                  active={isOpen}
                />
              )}
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

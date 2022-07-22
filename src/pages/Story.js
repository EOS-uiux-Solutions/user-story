import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import {
  TwitterShareButton,
  LinkedinShareButton,
  TwitterIcon,
  LinkedinIcon
} from 'react-share'
import Gallery from '../components/ImageGallery'
import { EOS_SHARE, EOS_CONTENT_COPY } from 'eos-icons-react'
import StoryPageTimeline from '../components/StoryPageTimeline'
import ShowMore from '../components/ShowMore'
import { Helmet } from 'react-helmet'
import toast from 'react-hot-toast'
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

  const fetchStory = async () => {
    const response = await userStory.getStory(storyId)
    setStory(response.data.data.userStory)
  }

  useEffect(() => {
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
    toast.success('Changes saved successfully')
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
    toast.success('Link copied to clipboard')
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
                ? 'body-content flex story-page-second'
                : 'body-content flex story-page'
            }
          >
            <div className='body-wrapper body-wrapper-left'>
              <div className='story-heading flex flex-column'>
                <span>
                  <h1 style={{ marginBlockEnd: '0px' }}>{story.Title}</h1>
                </span>
                <div className='author-information'>
                  <h4 className='date'>
                    Created At:{' '}
                    {new Date(story.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h4>
                  <div className='name'>
                    <h4>
                      By:{' '}
                      <Link
                        className='link link-default'
                        to={`/profile/${story.author.id}`}
                      >
                        @{story.author.username}
                      </Link>
                    </h4>
                    <div className='user-avatar'>
                      <img
                        className='avatar'
                        src={
                          story.author.profilePicture
                            ? story.author.profilePicture.url
                            : `https://avatars.dicebear.com/api/jdenticon/${story.author.username}.svg`
                        }
                        alt='Default User Avatar'
                      ></img>
                    </div>
                  </div>
                  <div className='target-product'>
                    <h4>Target Product:</h4>
                    <img
                      src={story.product.logo?.url}
                      className='product-logo'
                      alt={story.product.Name}
                    />
                  </div>
                  <div>
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
                        <Button
                          className='share-story'
                          onClick={togglePopup}
                          data-cy='share-story-btn'
                        >
                          <EOS_SHARE className='eos-icons' />
                        </Button>
                        <Button className='share-story' onClick={copy}>
                          <EOS_CONTENT_COPY className='eos-icons' />
                        </Button>
                      </>
                    }
                  </div>
                </div>
              </div>

              <div className='flex flex-col story-page-body'>
                {editor ? (
                  <div data-cy='edit-description' className='story-editor'>
                    <MarkdownEditor
                      callback={(html) => {
                        setDescription(html)
                      }}
                    />
                  </div>
                ) : (
                  <div className='flex flex-col'>
                    <ShowMore
                      maxCharacterLimit={350}
                      txt={story.Description}
                      textLength={story.Description.length}
                    />
                    {!!story.Attachment.length && (
                      <div className='gallery-container flex-column'>
                        <Gallery imageArray={story.Attachment} />
                      </div>
                    )}
                  </div>
                )}
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
                        data-cy='twitter-share-btn'
                      >
                        <TwitterIcon />
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={window.location}
                        className='share-button'
                        onShareWindowClose={togglePopup}
                        data-cy='linkedin-share-btn'
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
            <div className='body-wrapper-right'>
              <StoryPageTimeline
                story={story}
                currentStatus={story.user_story_status.Status}
                fetchStory={fetchStory}
              />
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

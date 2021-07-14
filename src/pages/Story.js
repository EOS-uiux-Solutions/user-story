import React, { useEffect, useState } from 'react'
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

import MarkdownEditor from '../components/MarkdownEditor'
import { filterDescriptionText } from '../utils/filterText'
import Comments from '../components/Comments'
import Timeline from '../components/Timeline'
import Button from '../components/Button'
import LoadingIndicator from '../modules/LoadingIndicator'
import Navigation from '../components/Navigation'
import { Link, navigate } from '@reach/router'
import Vote from '../components/Vote'
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
                <div data-cy='edit-description'>
                  <MarkdownEditor
                    callback={(html) => {
                      setDescription(html)
                    }}
                  />
                </div>
              ) : (
                <div
                  className='story-description'
                  dangerouslySetInnerHTML={{ __html: story.Description }}
                  data-cy='story-description'
                />
              )}
              <div className='story-buttons-container'>
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
                {!editor ? (
                  <>
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
                  <Button
                    className='btn btn-default'
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
              <div>
                {story.Attachment &&
                  story.Attachment.map((obj) => (
                    <img
                      key={obj.id}
                      src={obj.url}
                      alt='attachment'
                      height='100'
                    />
                  ))}
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

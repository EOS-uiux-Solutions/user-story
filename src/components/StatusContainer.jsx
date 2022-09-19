import React from 'react'
import { navigate, Link } from '@reach/router'
import { EOS_COMMENT, EOS_ATTACHMENT } from 'eos-icons-react'
import { strip } from '../utils/filterText'
import Vote from './Vote'

function StatusContainer(props) {
  const { state, stories } = props

  const filteredStories = stories.filter(
    (story) => story.user_story_status.Status === state.status
  )

  return (
    <div className='status-container'>
      <h3 className='status'>{state.status}</h3>
      <div className='wrapper'>
        {filteredStories.map((story, key) => (
          <div className='story flex flex-column' key={key} draggable>
            <div
              data-cy='story-row'
              className='stories-content'
              onClick={() => {
                navigate(`/story/${story.id}`)
              }}
            >
              <a href={`/story/${story.id}`} className='h3'>
                {strip(story.Title, 80)}
              </a>
              <p>{strip(story.Description, 80)}</p>
            </div>
            <div className='story-small-details flex flex-column'>
              <div className='story-author story-subcontent flex'>
                <div className='flex'>
                  <small>Created By &nbsp;</small>
                  <div className='user-avatar'>
                    <img
                      className='avatar'
                      src={
                        story?.author?.profilePicture?.url ??
                        `https://avatars.dicebear.com/api/jdenticon/${story.author.username}.svg`
                      }
                      alt='Default User Avatar'
                    ></img>
                  </div>
                  <Link
                    className='link link-default'
                    to={`/profile/${story.author.id}`}
                  >
                    {story.author.username}
                  </Link>
                </div>
              </div>
              <div className='flex story-subcontent'>
                <small>Category &nbsp;</small>
                <span className='category-text'>{story.Category}</span>
              </div>
              <div className='flex s-metas'>
                <Vote story={story} small />
                <span className='story-meta-wrapper'>
                  <span className='story-meta'>
                    <EOS_ATTACHMENT className='eos-icons' />
                    {story.Attachment.length}
                  </span>
                  <span className='story-meta'>
                    <EOS_COMMENT className='eos-icons' />
                    {story.user_story_comments.length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatusContainer

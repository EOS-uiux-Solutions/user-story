import React from 'react'
import { navigate, Link } from '@reach/router'
import { EOS_COMMENT, EOS_ATTACHMENT } from 'eos-icons-react'
import { strip } from '../utils/filterText'
import Vote from './Vote'
import { Draggable } from 'react-beautiful-dnd'

function RoadmapStoryCard(props) {
  const { story, index, isDragDisabled } = props
  return (
    <Draggable
      draggableId={story.id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided) => (
        <div
          className='story flex flex-column'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
      )}
    </Draggable>
  )
}

export default RoadmapStoryCard

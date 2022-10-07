import React, { useEffect } from 'react'
import { navigate, Link } from '@reach/router'
import { EOS_COMMENT, EOS_ATTACHMENT } from 'eos-icons-react'
import { strip } from '../utils/filterText'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import Vote from './Vote'

function StoryCard(props) {
  const { story, index } = props
  return (
    <Draggable draggableId={story.id} index={index}>
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

function StatusContainer(props) {
  const { state } = props
  const [stories, setStories] = React.useState([])

  const filterStories = React.useCallback(() => {
    const filteredStories = props.stories.filter(
      (story) => story.user_story_status.Status === state.status
    )
    setStories(filteredStories)
  }, [props.stories, state.status])

  useEffect(() => {
    filterStories()
  }, [props.stories, filterStories])

  return (
    <div className='status-container'>
      <h3 className='status'>{state.status}</h3>
      <Droppable droppableId={state.status} index={props.index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            className='wrapper'
            {...provided.droppableProps}
          >
            {stories.map((story, index) => (
              <>
                <StoryCard story={story} key={index} index={index} />
                {provided.placeholder}
              </>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default StatusContainer

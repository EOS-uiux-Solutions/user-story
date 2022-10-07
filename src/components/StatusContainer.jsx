import React, { useEffect } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import RoadmapStoryCard from './RoadmapStoryCard'

function StatusContainer(props) {
  const { state, isDragDisabled } = props
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
                <RoadmapStoryCard
                  story={story}
                  key={index}
                  index={index}
                  isDragDisabled={isDragDisabled}
                />
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

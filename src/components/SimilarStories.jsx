import React from 'react'
import SimilarStoryCard from './SimilarStoryCard'

function SimilarStories(props) {
  const { titleText, titleLink, stories, currentId } = props

  return (
    <div className='similar-stories flex flex-column'>
      <h3 className='title'>
        {`${titleText} `}
        {titleLink}
      </h3>
      {stories.map(
        (story, key) =>
          story.id !== currentId && <SimilarStoryCard story={story} key={key} />
      )}
    </div>
  )
}

export default SimilarStories

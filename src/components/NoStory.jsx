import React from 'react'

function NoStory() {
  return (
    <div className='no-story'>
      <strong>No story found</strong>
      <a href='/newStory' className='link link-default'>
        Create a new story instead
      </a>
    </div>
  )
}

export default NoStory

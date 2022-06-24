import React from 'react'
import '../assets/scss/components/NoStory.scss'

function NoStory() {
  return (
    <div className='noStory'>
      <p>No story found</p>
      <a href='/newStory'>Create a new story instead</a>
    </div>
  )
}

export default NoStory

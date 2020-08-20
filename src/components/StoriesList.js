import React from 'react'
import { navigate } from '@reach/router'

import Vote from './Vote'

const StoriesList = (props) => {
  const { stories, state, product } = props

  const strip = (html) => {
    return html.replace(/<\s*[^>]*>/gi, '')
  }

  return (
    <div className='flex flex-column'>
      {stories && stories.length ? (
        stories.map((story, key) => {
          return story.user_story_status.Status === state &&
            (story.product.Name === product || product === 'All') ? (
            <div className='story' key={key}>
              <div
                onClick={() => {
                  navigate(`/story/${story.id}`)
                }}
              >
                <div className='stories-content'>
                  <h4>{story.Title}</h4>
                  {strip(story.Description)}
                </div>
              </div>
              <div>
                <Vote story={story} />
                <div className='icon-display'>
                  {story.user_story_comments.length}
                  <i className='eos-icons'>comment</i>
                </div>
              </div>
            </div>
          ) : (
            ''
          )
        })
      ) : (
        <h3>No stories</h3>
      )}
    </div>
  )
}

export default StoriesList

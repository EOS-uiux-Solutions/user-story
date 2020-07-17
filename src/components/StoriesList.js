import React from 'react'
import { navigate } from '@reach/router'

const StoriesList = (props) => {
  const { stories, state } = props

  const strip = (html) => {
    return html.replace(/<\s*[^>]*>/gi, '')
  }

  return (
    <>
      {!state ? (
        stories.length ? (
          stories.map((story, key) => {
            return (
              <div
                className='story'
                key={key}
                onClick={() => {
                  navigate(`/story/${story.id}`)
                }}
              >
                <div className='stories-content'>
                  <h4>{story.Title}</h4>
                  {strip(story.Description)}
                </div>
                <div className='icon-display'>
                  {story.Votes}
                  <i className='eos-icons'>thumb_up</i>
                </div>
                <div className='icon-display'>
                  {story.user_story_comments.length}
                  <i className='eos-icons'>comment</i>
                </div>
              </div>
            )
          })
        ) : (
          <h3>No stories</h3>
        )
      ) : stories.length ? (
        stories.map((story, key) => {
          return story.user_story_status.Status === state ? (
            <div
              className='story'
              key={key}
              onClick={() => {
                navigate(`/story/${story.id}`)
              }}
            >
              <div className='stories-content'>
                <h4>{story.Title}</h4>
                {strip(story.Description)}
              </div>
              <div className='icon-display'>
                {story.Votes}
                <i className='eos-icons'>thumb_up</i>
              </div>
              <div className='icon-display'>
                {story.user_story_comments.length}
                <i className='eos-icons'>comment</i>
              </div>
            </div>
          ) : (
            ''
          )
        })
      ) : (
        <h3>No stories</h3>
      )}
    </>
  )
}

export default StoriesList

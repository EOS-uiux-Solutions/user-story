import React from 'react'
import { navigate, Link } from '@reach/router'

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
              <Vote story={story} />
              <div
                className='stories-content'
                onClick={() => {
                  navigate(`/story/${story.id}`)
                }}
              >
                <div className='story-title'>{story.Title}</div>
                <div className='story-description'>
                  {strip(story.Description)}
                </div>
              </div>
              <div className='flex flex-row author-info'>
                <div className='user-avatar'>
                  <img
                    className='avatar'
                    src={`https://api.adorable.io/avatars/100/${story.author.username}`}
                    alt='Default User Avatar'
                  ></img>
                </div>
                <div className='flex flex-column'>
                  <span className='mini-label'>Created by</span>
                  <Link
                    className='link link-default'
                    to={`/profile/${story.author.id}`}
                  >
                    {story.author.username}
                  </Link>
                </div>
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
    </div>
  )
}

export default StoriesList

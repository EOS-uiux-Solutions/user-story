import React from 'react'
import { navigate, Link } from '@reach/router'

import Vote from './Vote'

const StoriesList = (props) => {
  const { stories, state, product } = props

  const strip = (html) => {
    html = html.replace(/<\s*[^>]*>/gi, '')
    if (html.length > 80) {
      html = `${html.substring(0, 80)}...`
    }
    return html
  }

  return (
    <div className='flex flex-column'>
      {stories && stories.length ? (
        stories.map((story, key) => {
          return story.user_story_status?.Status === state &&
            (story.product.Name === product || product === 'All') ? (
            <div className='story' key={key}>
              <Vote story={story} />
              <div
                className='stories-content'
                onClick={() => {
                  navigate(`/story/${story.id}`)
                }}
              >
                <h3>{story.Title}</h3>
                <p>{strip(story.Description)}</p>
              </div>
              <div className='story-author story-subcontent'>
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
                <div className='flex flex-column'>
                  <small>Created by</small>
                  <Link
                    className='link link-default'
                    to={`/profile/${story.author.id}`}
                  >
                    {story.author.username}
                  </Link>
                </div>
              </div>
              <div className='flex flex-column story-subcontent'>
                <small>Category</small>
                <span className='category-text'>{story.Category}</span>
              </div>
              <div className='flex flex-column'>
                <span className='story-meta'>
                  <i className='eos-icons'>attachment</i>
                  {story.user_story_comments.length}
                </span>
                <span className='story-meta'>
                  <i className='eos-icons'>comment</i>
                  {story.user_story_comments.length}
                </span>
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

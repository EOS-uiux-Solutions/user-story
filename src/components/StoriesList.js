import React from 'react'
import { navigate, Link } from '@reach/router'
import { EOS_COMMENT, EOS_ATTACHMENT } from 'eos-icons-react'

import Vote from './Vote'
import { strip } from '../utils/filterText'
import Skeleton from 'react-loading-skeleton'

const StorySkeleton = () => (
  <div className='story'>
    <div className='vote-wrapper-loading'>
      <Skeleton height={80} />
    </div>
    <div className='stories-content'>
      <h3>
        <Skeleton height={20} />
      </h3>
      <p>
        <Skeleton />
      </p>
    </div>
    <div className='story-author story-subcontent'>
      <div className='user-avatar'>
        <Skeleton circle width={58} height={58} />
      </div>
      <div className='flex flex-column'>
        <Skeleton width={52} />
      </div>
    </div>
    <div className='flex flex-column story-subcontent'>
      <Skeleton width={52} />
    </div>
    <div className='flex flex-column'>
      <span className='story-meta'>
        <Skeleton width={52} />
      </span>
      <span className='story-meta'>
        <Skeleton width={52} />
      </span>
    </div>
  </div>
)

const StoriesList = (props) => {
  const { stories, isLoading } = props

  if (isLoading) {
    return (
      <div className='flex flex-column'>
        {[1, 2, 3, 4, 5].map((i) => (
          <StorySkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-column' data-cy='stories'>
      {stories && stories.length ? (
        stories.map((story, key) => {
          return (
            <div className='story' key={key}>
              <Vote story={story} />
              <div
                className='stories-content'
                onClick={() => {
                  navigate(`/story/${story.id}`)
                }}
              >
                <h3>{strip(story.Title, 80)}</h3>
                <p>{strip(story.Description, 80)}</p>
              </div>
              <div className='story-small-details'>
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
                  <small>Created At</small>
                  <small>{story.createdAt}</small>
                </div>
                <div className='flex flex-column story-subcontent'>
                  <small>Category</small>
                  <span className='category-text'>{story.Category}</span>
                </div>
                <div className='flex flex-column story-subcontent'>
                  <small>Priority</small>
                  <span className='category-text'>{story.Priority}</span>
                </div>
                <div className='flex flex-column s-metas'>
                  <span className='story-meta'>
                    <EOS_ATTACHMENT className='eos-icons' />
                    {story.Attachment.length}
                  </span>
                  <span className='story-meta'>
                    <EOS_COMMENT className='eos-icons' />
                    {story.user_story_comments.length}
                  </span>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <h3>No stories</h3>
      )}
    </div>
  )
}

export default StoriesList

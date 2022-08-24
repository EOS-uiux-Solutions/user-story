import React from 'react'
import { navigate } from '@reach/router'
import {
  EOS_THUMB_UP,
  EOS_MESSAGE,
  EOS_CALENDAR_TODAY_FILLED
} from 'eos-icons-react'

function Card(props) {
  const { story } = props
  return (
    <div
      className='card flex flex-column'
      onClick={() => {
        navigate(`/story/${story.id}`)
      }}
    >
      <div>
        <h3 className='link link-default subject'>{story.Title}</h3>
      </div>
      <div className='info flex'>
        <div className='left'>
          <EOS_CALENDAR_TODAY_FILLED />
          {new Date(story.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className='right'>
          <span>
            <EOS_THUMB_UP />
            {story.followers.length}
          </span>
          <span>
            <EOS_MESSAGE />
            {story.user_story_comments.length}
          </span>
        </div>
      </div>
    </div>
  )
}

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
          story.id !== currentId && <Card story={story} key={key} />
      )}
    </div>
  )
}

export default SimilarStories

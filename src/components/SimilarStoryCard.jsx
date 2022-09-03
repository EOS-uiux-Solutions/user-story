import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EOS_THUMB_UP,
  EOS_MESSAGE,
  EOS_CALENDAR_TODAY_FILLED
} from 'eos-icons-react'

function SimilarStoryCard(props) {
  const { story } = props
  const navigate = useNavigate()

  return (
    <div
      className='card flex flex-column'
      onClick={() => {
        navigate(`/story/${story.id}`, { replace: true })
      }}
    >
      <div>
        <a className='link link-default subject' href={`/story/${story.id}`}>
          {story.Title}
        </a>
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

export default SimilarStoryCard

import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Link } from '@reach/router'
import userStory from '../services/user_story'
import Lists from '../utils/Lists'

const StoryPageTimeline = (props) => {
  const { story, currentStatus } = props

  const userId = localStorage.getItem('id')

  const followerIds = story.followers.map((follower) =>
    JSON.stringify(follower.id)
  )

  const [followers, setFollowers] = useState(followerIds)

  const [votes, setVotes] = useState(story.followers.length)

  const [voteClicked, setVoteClicked] = useState(false)

  const [voted, setVoted] = useState(false)

  const [isOpen, setIsOpen] = useState(false)

  const [previousStatuses, setPreviousStatuses] = useState([])

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const setStatuses = () => {
      const tempList = []
      for (let i = 0; i < Lists.stateList.length; i++) {
        tempList.push(Lists.stateList[i].status)
        if (Lists.stateList[i].status === currentStatus) break
      }

      setPreviousStatuses(tempList)
    }
    setStatuses()
  }, [currentStatus])

  useEffect(() => {
    const followerIds = story.followers.map((follower) => follower.id)
    if (followerIds.includes(userId)) {
      setVoted(true)
    }
  }, [story.followers, userId])

  const updateVote = async (story) => {
    setVoteClicked(true)
    if (voted) {
      let updatedFollowerIds = followers.filter(
        (id) => id !== JSON.stringify(userId)
      )
      const response = await userStory.updateVotes(story.id, updatedFollowerIds)
      updatedFollowerIds = response.data.data.updateUserStory.userStory.followers.map(
        (follower) => JSON.stringify(follower.id)
      )
      setFollowers(updatedFollowerIds)
      setVoted(false)
      setVotes((votes) => votes - 1)
    } else {
      followers.push(JSON.stringify(userId))
      let updatedFollowerIds = followers
      const response = await userStory.updateVotes(story.id, updatedFollowerIds)
      updatedFollowerIds = response.data.data.updateUserStory.userStory.followers.map(
        (follower) => JSON.stringify(follower.id)
      )
      setFollowers(updatedFollowerIds)
      setVoted(true)
      setVotes((votes) => votes + 1)
    }
    setVoteClicked(false)
  }

  return (
    <div>
      <div
        className={`flex flex-column story-vote-wrapper ${
          userId && voted ? 'story-vote-wrapper-voted' : ''
        }`}
      >
        <div
          className={`story-vote-button ${
            userId ? 'story-vote-button-clickable' : ''
          }`}
          onClick={() => {
            if (userId && !voteClicked) updateVote(story)
          }}
        >
          <i className='eos-icons'>thumb_up</i>
        </div>
        <div className='story-votes-count' onClick={togglePopup}>
          {votes} Votes
        </div>
        {isOpen && (
          <Modal
            content={
              <>
                <div>
                  {story.followers.length === 0 ? (
                    <h1>No Voters For This Story</h1>
                  ) : (
                    <h1>Voters For This Story</h1>
                  )}
                </div>
                {story.followers.map((voters) => (
                  <div className='flex flex-row author-information'>
                    <div className='user-avatar avatar-vote'>
                      <img
                        className='avatar'
                        src={`https://avatars.dicebear.com/api/jdenticon/${voters.username}.svg`}
                        alt='Default User Avatar'
                      ></img>
                    </div>
                    <div>
                      <Link
                        className='link-vote link link-default'
                        to={`/profile/${voters.id}`}
                      >
                        {voters.username}
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            }
            handleClose={togglePopup}
            active={isOpen}
          />
        )}
      </div>
      <div className='storypage-timeline'>
        {Lists.stateList.map((ele, key) => {
          return (
            <div className='status-element' key={key}>
              {previousStatuses.includes(ele.status) ? (
                <div className='status-current'>
                  <i className='eos-icons status-icon'>{ele.icon}</i>
                  {ele.status}
                </div>
              ) : (
                <div className='status-previous'>
                  <i className='eos-icons status-icon'>{ele.icon}</i>
                  {ele.status}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='story-pattern'>
        <svg
          width='155'
          height='252'
          viewBox='0 0 300 500'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='Desktop - 1'>
            <rect
              width='1024'
              height='1440'
              transform='translate(-250 -450)'
              fill='#F5F9FA'
            />
            <g id='Group 1'>
              <path
                id='Rectangle 6'
                d='M50 325C50 311.193 61.1929 300 75 300V300C88.8071 300 100 311.193 100 325V475C100 488.807 88.8071 500 75 500V500C61.1929 500 50 488.807 50 475V325Z'
                fill='#42779B'
              />
              <rect
                id='lightBlueRectangle'
                width='150'
                height='50'
                fill='#42779B'
              />
              <rect
                id='blueRectangle'
                x='150'
                width='150'
                height='100'
                fill='#1A2A3A'
              />
              <rect
                id='blueSquare'
                y='50'
                width='150'
                height='150'
                fill='#1A2A3A'
              />
              <circle
                id='whiteCircle'
                cx='75.5'
                cy='125.5'
                r='37.5'
                fill='#F5F9FA'
              />
              <rect
                id='Rectangle 5'
                x='150'
                y='100'
                width='150'
                height='400'
                fill='#1A2A3A'
              />
              <path
                id='whiteQuater'
                d='M150 100H300V150C300 205.228 255.228 250 200 250H150V100Z'
                fill='white'
              />
              <circle id='blueCircle' cx='75' cy='245' r='25' fill='#42779B' />
              <path
                id='blueQuater'
                d='M150 450C150 394.772 194.772 350 250 350H300V500H150V450Z'
                fill='#42779B'
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default StoryPageTimeline

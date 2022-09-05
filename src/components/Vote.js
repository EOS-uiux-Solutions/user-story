import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Link } from '@reach/router'
import userStory from '../services/user_story'
import { EOS_THUMB_UP } from 'eos-icons-react'

const Vote = (props) => {
  const { story } = props

  const userId = localStorage.getItem('id')

  const followerIds = story.followers.map((follower) =>
    JSON.stringify(follower.id)
  )

  const [followers, setFollowers] = useState(followerIds)

  const [votes, setVotes] = useState(story.followers.length)

  const [voteClicked, setVoteClicked] = useState(false)

  const [voted, setVoted] = useState(false)

  const [isOpen, setIsOpen] = useState(false)

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

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
      updatedFollowerIds =
        response.data.data.updateUserStory.userStory.followers.map((follower) =>
          JSON.stringify(follower.id)
        )
      setFollowers(updatedFollowerIds)
      setVoted(false)
      setVotes((votes) => votes - 1)
    } else {
      followers.push(JSON.stringify(userId))
      let updatedFollowerIds = followers
      const response = await userStory.updateVotes(story.id, updatedFollowerIds)
      updatedFollowerIds =
        response.data.data.updateUserStory.userStory.followers.map((follower) =>
          JSON.stringify(follower.id)
        )
      setFollowers(updatedFollowerIds)
      setVoted(true)
      setVotes((votes) => votes + 1)
    }
    setVoteClicked(false)
  }

  if (props.small) {
    return (
      <div
        className={`flex vote-wrapper ${
          userId && voted ? 'vote-wrapper-voted' : ''
        }`}
      >
        <div className='votes-count'>{votes}</div>
        <div
          className='vote-button'
          onClick={() => {
            if (userId && !voteClicked) updateVote(story)
          }}
        >
          {!userId ? (
            <Link className='vote-link' to='/login'>
              <EOS_THUMB_UP className='eos-icons' color='white' />
            </Link>
          ) : (
            <>
              <EOS_THUMB_UP className='eos-icons' color='white' />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-column vote-wrapper ${
        userId && voted ? 'vote-wrapper-voted' : ''
      }`}
    >
      <div className='votes-count' onClick={togglePopup}>
        {votes}
      </div>
      <div
        className='vote-button'
        onClick={() => {
          if (userId && !voteClicked) updateVote(story)
        }}
      >
        {!userId ? (
          <Link className='vote-link' to='/login'>
            <EOS_THUMB_UP className='eos-icons' color='white' />
            Vote
          </Link>
        ) : (
          <>
            <EOS_THUMB_UP className='eos-icons' color='white' />
            Vote
          </>
        )}
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
  )
}

export default Vote

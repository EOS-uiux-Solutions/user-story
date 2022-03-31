import React, { useState, useEffect, useReducer } from 'react'
import Modal from './Modal'
import { Link } from '@reach/router'
import userStory from '../services/user_story'
import { EOS_THUMB_UP } from 'eos-icons-react'

function reducer(state, action) {
  switch (action.type) {
    case 'upVote':
      return { votes: state.votes + 1 }
    case 'downVote':
      return { votes: state.votes - 1 }
    default:
      throw new Error()
  }
}

const Vote = (props) => {
  const { story } = props

  const userId = localStorage.getItem('id')

  const followerIds = story.followers.map((follower) =>
    JSON.stringify(follower.id)
  )

  const [state, dispatch] = useReducer(reducer, {
    votes: story.followers.length
  })

  const [followers, setFollowers] = useState(followerIds)

  const [voters, setVoters] = useState(story.followers)

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
      dispatch({ type: 'downVote' })
      setVoters(response.data.data.updateUserStory.userStory.followers)
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
      dispatch({ type: 'upVote' })
      setVoters(response.data.data.updateUserStory.userStory.followers)
    }
    setVoteClicked(false)
  }

  return (
    <div
      className={`flex flex-column vote-wrapper ${
        userId && voted ? 'vote-wrapper-voted' : ''
      }`}
    >
      <div className='votes-count' onClick={togglePopup}>
        {state.votes}
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
                {voters.length === 0 ? (
                  <h1>No Voters For This Story</h1>
                ) : (
                  <h1>Voters For This Story</h1>
                )}
              </div>
              {voters.map((voter) => (
                <div className='flex flex-row author-information'>
                  <div className='user-avatar avatar-vote'>
                    <img
                      className='avatar'
                      src={
                        voter?.profilePicture
                          ? voter?.profilePicture?.url
                          : `https://avatars.dicebear.com/api/jdenticon/${voter.username}.svg`
                      }
                      alt='Default User Avatar'
                    ></img>
                  </div>
                  <div>
                    <Link
                      className='link-vote link link-default'
                      to={`/profile/${voter.id}`}
                    >
                      {voter.username}
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

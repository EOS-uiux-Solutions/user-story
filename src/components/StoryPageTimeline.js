import React, { useState, useEffect, useReducer } from 'react'
import Modal from './Modal'
import { Link } from '@reach/router'
import userStory from '../services/user_story'
import Lists from '../utils/Lists'
import { EOS_THUMB_UP } from 'eos-icons-react'
import storyPagePattern from '../assets/images/story-page-pattern.svg'

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

const StoryPageTimeline = (props) => {
  const { story, currentStatus } = props

  const userId = localStorage.getItem('id')

  const followerIds = story.followers.map((follower) =>
    JSON.stringify(follower.id)
  )

  const [followers, setFollowers] = useState(followerIds)

  const [state, dispatch] = useReducer(reducer, {
    votes: story.followers.length
  })

  const [voteClicked, setVoteClicked] = useState(false)

  const [voters, setVoters] = useState(story.followers)

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
      updatedFollowerIds =
        response.data.data.updateUserStory.userStory.followers.map((follower) =>
          JSON.stringify(follower.id)
        )
      setFollowers(updatedFollowerIds)
      setVoted(false)
      dispatch({ type: 'downVote' })
      setVoters(response.data.data.updateUserStory.userStory.followers)
      console.log(voters)
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
    <div>
      <div
        className={`flex flex-column story-vote-wrapper ${
          userId && voted ? 'story-vote-wrapper-voted' : ''
        }`}
      >
        <div
          data-cy='story-vote-btn'
          className={`story-vote-button ${
            userId ? 'story-vote-button-clickable' : ''
          }`}
          onClick={() => {
            if (userId && !voteClicked) updateVote(story)
          }}
        >
          <EOS_THUMB_UP className='eos-icons' color='white' size='l' />
        </div>
        <div
          className='story-votes-count'
          onClick={togglePopup}
          data-cy='story-votes-count'
        >
          {state.votes} Votes
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
      <div className='storypage-timeline'>
        {Lists.stateList.map((ele, key) => {
          return (
            <div className='status-element' key={key}>
              {previousStatuses.includes(ele.status) ? (
                <div className='status-current'>
                  <div className='status-icon'>
                    {ele.icon}
                    {ele.status}
                  </div>
                </div>
              ) : (
                <div className='status-previous'>
                  <div className='status-icon'>
                    {ele.icon}
                    {ele.status}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='story-pattern'>
        <img src={storyPagePattern} alt='pattern' />
      </div>
    </div>
  )
}

export default StoryPageTimeline

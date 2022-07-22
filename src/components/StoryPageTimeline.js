import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Link } from '@reach/router'
import userStory from '../services/user_story'
import Lists from '../utils/Lists'
import { EOS_THUMB_UP } from 'eos-icons-react'
import { Stepper, Step, StepTitle } from 'react-custom-stepper'

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

  const [step, setStep] = useState(0)

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const setStatuses = () => {
      for (let i = 0; i < Lists.stateList.length; i++) {
        if (Lists.stateList[i].status === currentStatus) {
          setStep(i - 1)
          break
        }
      }
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
    props.fetchStory()
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
          {votes} Votes
        </div>
      </div>
      <div className='story-voters-list flex'>
        {story.followers.map((follower, key) => (
          <img
            className='avatar'
            src={
              follower.profilePicture && follower.profilePicture.url
                ? follower.profilePicture.url
                : `https://avatars.dicebear.com/api/jdenticon/${follower.username}.svg`
            }
            alt='Default User Avatar'
            key={key}
          />
        ))}
      </div>
      <div className='story-voters-list-modal'>
        <p className='text' onClick={togglePopup}>
          See All Voters
        </p>
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
        <Stepper vertical step={step}>
          {Lists.stateList.slice(1).map((ele) => (
            <Step customContent={() => ele.icon}>
              <StepTitle>{ele.status}</StepTitle>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  )
}

export default StoryPageTimeline

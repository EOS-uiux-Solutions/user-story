import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import Modal from './Modal'
import { Link } from '@reach/router'

const Vote = (props) => {
  const { story } = props

  const userId = localStorage.getItem('id')

  const [followers, setFollowers] = useState([])

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
    let followerIds = story.followers.map((follower) =>
      JSON.stringify(follower.id)
    )
    if (voted) {
      followerIds = followerIds.filter((id) => id !== JSON.stringify(userId))
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
        mutation {
          updateUserStory(input: {where: {id: "${story.id}"} data: {followers: [${followerIds}]}}){
            userStory{
              followers {
                id
              }
            }
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setVoteClicked(false)
      followerIds = response.data.data.updateUserStory.userStory.followers.map(
        (follower) => JSON.stringify(follower.id)
      )
      setFollowers(followerIds)
      setVoted(false)
      setVotes((votes) => votes - 1)
    } else {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
        mutation {
          updateUserStory(input: {where: {id: "${story.id}"} data: {followers: [${followers}, "${userId}"]}}){
            userStory{
              followers {
                id
              }
            }
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setVoteClicked(false)
      const followerIds = response.data.data.updateUserStory.userStory.followers.map(
        (follower) => JSON.stringify(follower.id)
      )
      setFollowers(followerIds)
      setVoted(true)
      setVotes((votes) => votes + 1)
    }
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
        className={`vote-button ${userId ? 'vote-button-clickable' : ''}`}
        onClick={() => {
          if (userId) updateVote(story)
        }}
        disabled={voteClicked}
      >
        <i className='eos-icons'>thumb_up</i>
        Vote
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

import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { navigate } from '@reach/router'

import Stories from '../components/Stories'
import Navigation from '../components/Navigation'
import UserProfile from '../components/UserProfile'

import userStory from '../services/user_story'
import isMongoID from '../utils/IsMongoID'

const Profile = (props) => {
  const { identifier } = props
  const [user, setUser] = useState('')

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isMongoID(identifier)) {
        const response = await userStory.getUserDetails(identifier)
        setUser(response.data.data.user)
      } else {
        const response = await userStory.getUserDetailsByUsername(identifier)
        setUser(response.data.data.users[0])
      }
    }
    if (identifier) {
      fetchUserInfo()
    }
  }, [identifier])

  if (user === null) {
    navigate('/404', { replace: true })
    return null
  }

  return (
    <>
      <Helmet>
        <title>{`${user.username} | EOS User story`}</title>
        <meta name='description' content={`${user.Bio}`} />
        <meta name='keywords' content='user story, issue tracker' />
      </Helmet>
      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper'>
          <div className='flex flex-row flex-space-around'>
            <div className='flex flex-column'>
              <UserProfile user={user} />
            </div>
          </div>
          <div className='flex flex-column'>
            <h3>Stories by this user</h3>
            <Stories authorId={user._id} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile

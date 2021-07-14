import React, { useState, useEffect } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Helmet } from 'react-helmet'
import { navigate } from '@reach/router'

import LoadingIndicator from '../modules/LoadingIndicator'
import Stories from '../components/Stories'
import Navigation from '../components/Navigation'
import UserProfile from '../components/UserProfile'

import userStory from '../services/user_story'

const Profile = (props) => {
  const { profileId } = props
  const [user, setUser] = useState('')

  const { promiseInProgress } = usePromiseTracker()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await userStory.getUserDetails(profileId)
      setUser(response.data.data.user)
    }
    if (profileId) {
      trackPromise(fetchUserInfo())
    }
  }, [profileId])

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
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : (
            <div className='flex flex-row flex-space-around'>
              <div className='flex flex-column'>
                <UserProfile user={user} />
              </div>
            </div>
          )}
          <div className='flex flex-column'>
            <h3>Stories by this user</h3>
            <Stories profileId={profileId} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile

import React, { useEffect, useState, useContext } from 'react'
import { Helmet } from 'react-helmet'
import toast from 'react-hot-toast'
import Navigation from '../components/Navigation'
import Context from '../modules/Context'
import Login from './Login'
import UserProfile from '../components/UserProfile'
import userStory from '../services/user_story'
import { useOktaAuth } from '@okta/okta-react'

const MyProfile = () => {
  const userId = localStorage.getItem('id')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { authState, oktaAuth } = useOktaAuth() === null ? null : useOktaAuth()

  const { state } = useContext(Context)

  const [user, setUser] = useState('')

  const [, setUpdated] = useState(false)

  const handleInputChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const updateProfile = async () => {
    try {
      const response = await userStory.updateUser({ id: userId, ...user })
      if (response) {
        toast.success('Profile updated successfully')
        setUpdated(true)
      }
    } catch (err) {
      console.error(err.message)
      toast.error(err.message)
    }
  }

  useEffect(() => {
    console.log(authState)
    if (!authState || !authState.isAuthenticated) {
      const fetchUserInfo = async () => {
        const response = await userStory.getUserDetails(userId)
        setUser(response.data.data.user)
      }
      if (userId) {
        fetchUserInfo()
      }
    } else {
      console.log(authState.idToken.claims)
      setUser({
        username: authState.idToken.claims.preferred_username,
        email: authState.idToken.claims.email
      })
      // You can also get user information from the `/userinfo` endpoint
      /* oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      }); */
    }
  }, [authState, oktaAuth, userId])

  return state.auth ? (
    <>
      <Helmet>
        <title>My profile | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper'>
          <div className='flex flex-row user-profile-wrapper'>
            <div className='flex flex-column'>
              <UserProfile
                user={user === '' ? '' : Object.assign(user, { id: userId })}
                handleInputChange={handleInputChange}
                updateProfile={updateProfile}
                allowEditing
              />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Login message='Please login to access your profile' />
  )
}

export default MyProfile

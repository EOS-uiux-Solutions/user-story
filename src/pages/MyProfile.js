import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import LoadingIndicator from '../modules/LoadingIndicator'

import Navigation from '../components/Navigation'
import Context from '../modules/Context'
import Login from './Login'
import UserProfile from '../components/UserProfile'

const MyProfile = () => {
  const userId = localStorage.getItem('id')

  const { state } = useContext(Context)

  const [user, setUser] = useState('')

  const [, setUpdated] = useState(false)

  const { promiseInProgress } = usePromiseTracker()

  const handleInputChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const updateProfile = async () => {
    const response = await axios.post(
      `${apiURL}/graphql`,
      {
        query: `mutation {
        updateUser(input: {
          where: {
            id: "${userId}"
          }
          data: {
            Name: "${user.Name}"
            Profession: "${user.Profession}"
            Company: "${user.Company}"
            LinkedIn: "${user.LinkedIn}"
            Twitter: "${user.Twitter}"
            Bio: "${user.Bio}"
          }
        }) {
          user {
            username
          }
        }
      }`
      },
      {
        withCredentials: true
      }
    )
    if (response) {
      setUpdated(true)
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          user(id: "${userId}") {
            profilePicture {
              url
            }
            Name
            Bio
            username
            Company
            Profession
            email
            LinkedIn
            Twitter
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setUser(response.data.data.user)
    }
    if (userId) {
      trackPromise(fetchUserInfo())
    }
  }, [userId])

  return state.auth ? (
    <>
      <Navigation />
      {promiseInProgress ? (
        <LoadingIndicator />
      ) : (
        <div className='body-content'>
          <div className='body-wrapper'>
            <div className='flex flex-row flex-space-around'>
              <div className='flex flex-column'>
                  <UserProfile
                    user={user}
                    handleInputChange={handleInputChange}
                    updateProfile={updateProfile}
                    allowEditing
                >
                    <h1>Hello world</h1>
                  </UserProfile>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <Login message='Please login to access your profile' />
  )
}

export default MyProfile

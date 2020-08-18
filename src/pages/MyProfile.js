import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import LoadingIndicator from '../modules/LoadingIndicator'
import { Link } from '@reach/router'

import Navigation from '../components/Navigation'

import Button from '../components/Button'
import Context from '../modules/Context'
import Login from './Login'

const MyProfile = () => {
  const userId = localStorage.getItem('id')

  const { state } = useContext(Context)

  const [user, setUser] = useState('')

  const [edit, setEdit] = useState(false)

  const [updated, setUpdated] = useState(false)

  const { promiseInProgress } = usePromiseTracker()

  const handleInputChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const updateProfile = async () => {
    setEdit(false)
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
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : (
            <div className='profile-content'>
              <div className='flex flex-row flex-space-around'>
                <div className='flex flex-column'>
                  <div className='profile-picture-container'>
                    {user.profilePicture ? (
                      <img
                        className='profile-picture'
                        src={user.profilePicture.url}
                        alt='profile pic'
                      />
                    ) : (
                      <img
                        className='profile-picture'
                        src={`https://api.adorable.io/avatars/100/${user.username}`}
                        alt='profile pic'
                      />
                    )}
                    <Button className='btn btn-default'>
                      Change Profile Picture
                    </Button>
                  </div>
                  <div className='profile-picture-container'>
                    <textarea
                      rows='6'
                      cols='17'
                      name='Bio'
                      defaultValue={user.Bio ? user.Bio : ''}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className='flex flex-column'>
                  <div className='basic-about'>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Username:{' '}
                      </div>
                      <div className='about-element '> {user.username} </div>
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Email ID:{' '}
                      </div>
                      <div className='about-element '> {user.email} </div>
                    </div>
                    <Link className='link link-default' to='/changePassword'>
                      Change Password
                    </Link>
                  </div>
                  <div className='basic-about'>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Name:{' '}
                      </div>
                      <input
                        className='input-profile'
                        type='text'
                        name='Name'
                        value={user.Name !== 'null' ? user.Name : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Profession:{' '}
                      </div>
                      <input
                        className='input-profile'
                        type='text'
                        name='Profession'
                        value={
                          user.Profession !== 'null' ? user.Profession : ''
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Company/Institute:{' '}
                      </div>
                      <input
                        className='input-profile'
                        type='text'
                        name='Company'
                        value={user.Company !== 'null' ? user.Company : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        LinkedIn:{' '}
                      </div>
                      <input
                        className='input-profile'
                        type='text'
                        name='LinkedIn'
                        value={user.LinkedIn !== 'null' ? user.LinkedIn : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Twitter:{' '}
                      </div>
                      <input
                        className='input-profile'
                        type='text'
                        name='Twitter'
                        value={user.Twitter !== 'null' ? user.Twitter : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    {edit ? (
                      <>
                        <Button
                          className='btn btn-default'
                          onClick={updateProfile}
                        >
                          Save
                        </Button>
                        <Button
                          className='btn btn-default'
                          onClick={() => setEdit(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        className='btn btn-default'
                        onClick={() => setEdit(true)}
                      >
                        Update Profile
                      </Button>
                    )}
                    {updated ? <h3>Profile Updated successfully</h3> : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <Login message='Please login to access your profile' />
  )
}

export default MyProfile

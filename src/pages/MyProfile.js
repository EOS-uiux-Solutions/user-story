import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import LoadingIndicator from '../modules/LoadingIndicator'

import Button from '../components/Button'

const MyProfile = () => {
  const userId = localStorage.getItem('id')

  const [user, setUser] = useState('')

  const [updated, setUpdated] = useState(false)

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

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
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
                      readOnly={true}
                      defaultValue={user.Bio ? user.Bio : ''}
                    ></textarea>
                    <Button className='btn btn-default'>Change Bio</Button>
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
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Password:{' '}
                      </div>
                      <div className='about-element '> {}</div>
                    </div>
                    <Button className='btn btn-default'>Change Password</Button>
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
                    <Button className='btn btn-default' onClick={updateProfile}>
                      Update Profile
                    </Button>
                    {updated ? <h3>Profile Updated successfully</h3> : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyProfile

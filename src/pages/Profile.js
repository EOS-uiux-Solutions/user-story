import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'

import Navigation from '../components/Navigation'
import StoriesList from '../components/StoriesList'

const Profile = (props) => {
  const { profileId } = props
  const [stories, setStories] = useState([])
  const [user, setUser] = useState('')

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          user(id: "${profileId}") {
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
    if (profileId) {
      fetchUserInfo()
    }
  }, [profileId])

  useEffect(() => {
    const fetchMyStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          user(id: "${profileId}") {
            feature_requests {
              id
              Title
              Description
              feature_requests_status {
                Status
              }
              Votes
              feature_request_comments {
                Comments
              }
            }
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.user.feature_requests)
    }
    fetchMyStories()
  }, [profileId])

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='profile-content'>
            <div className='flex flex-row flex-space-around'>
              <div className='flex flex-column'>
                <div className='profile-picture-container'>
                  {user.profilePicture ? (
                    <img
                      className='profile-picture'
                      src={user.profilePicture.url}
                      alt='Profile'
                    />
                  ) : (
                    <img
                      className='profile-picture'
                      src={`https://api.adorable.io/avatars/100/${user.username}`}
                      alt='Profile'
                    />
                  )}
                </div>
                <textarea
                  rows='6'
                  cols='17'
                  readOnly={true}
                  defaultValue={user.Bio}
                ></textarea>
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
                      Name:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Name !== 'null' ? user.Name : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Profession:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Profession !== 'null' ? user.Profession : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Company/Institute:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Company !== 'null' ? user.Company : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      LinkedIn:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Linkedin !== 'null' ? user.Linkedin : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Twitter:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Twitter !== 'null' ? user.Twitter : ''}{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
              <div className='flex flex-column'>
                <h3>Stories by this user</h3>
                <StoriesList stories={stories} />
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile

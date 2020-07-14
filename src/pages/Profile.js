import React, { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { navigate } from '@reach/router'
import axios from 'axios'
import { apiURL } from '../config.json'

const profileInfo = {
  username: 'hawkeye777',
  email: 'hawkeye777@avengers.com',
  password: '******',
  name: 'hawkeye',
  profession: 'avenger',
  company: 'Avengers',
  linkedin: '',
  twitter: ''
}

const Profile = (props) => {
  const { profileId } = props
  const [stories, setStories] = useState([])

  const strip = (html) => {
    return html.replace(/<\s*[^>]*>/gi, '')
  }

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
            <div className='flex flex-column'>
              <div className='flex flex-row'>
                <div className='profile-picture-container'>
                  <div className='profile-picture'></div>
                </div>
                <div className='basic-about'>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Username:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {profileInfo.username}{' '}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-row'>
                <div className='profile-picture-container'>
                  <div className='profile-bio'>
                    <textarea
                      rows='6'
                      cols='17'
                      readOnly={true}
                      defaultValue='Some bio....'
                    ></textarea>
                  </div>
                </div>
                <div className='basic-about'>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Name:{' '}
                    </div>
                    <div className='about-element '> {profileInfo.name} </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Profession:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {profileInfo.profession}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Company/Institute:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {profileInfo.company}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      LinkedIn:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {profileInfo.linkedin}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Twitter:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {profileInfo.twitter}{' '}
                    </div>
                  </div>
                </div>
              </div>
              {
                <div className='flex flex-column'>
                  {stories.length ? (
                    stories.map((request, key) => {
                      return (
                        <div
                          className='request'
                          key={key}
                          onClick={() => {
                            navigate(`/story/${request.id}`)
                          }}
                        >
                          <div className='request-content'>
                            <h4>{request.Title}</h4>
                            {strip(request.Description)}
                          </div>
                          <div className='icon-display'>
                            {request.Votes}
                            <i className='eos-icons'>thumb_up</i>
                          </div>
                          <div className='icon-display'>
                            {request.feature_request_comments.length}
                            <i className='eos-icons'>comment</i>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <h3>No stories from this user</h3>
                  )}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile

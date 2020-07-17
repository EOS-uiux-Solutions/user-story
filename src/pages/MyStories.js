import React, { useState, useEffect } from 'react'
import { apiURL } from '../config.json'
import axios from 'axios'
import Navigation from '../components/Navigation'
import Button from '../components/Button'
import StoriesList from '../components/StoriesList'

const MyStories = () => {
  const [stories, setStories] = useState([])

  const [currentStateSelected, selectState] = useState('My Submissions')

  const id = localStorage.getItem('id')

  useEffect(() => {
    const fetchMyStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            user(id: "${id}") {
              user_stories {
                id
                Title
                Description
                Votes
                user_story_comments {
                  Comments
                }
                user_story_status {
                  Status
                }
              }
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.user.user_stories)
    }
    fetchMyStories()
  }, [id])

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='mystories-content'>
            <h3>My Stories</h3>
            <div className='flex flex-row'>
              <Button
                className={
                  currentStateSelected === 'My Submissions'
                    ? 'btn btn-tabs btn-tabs-selected'
                    : 'btn btn-tabs'
                }
                onClick={() => selectState('My Submissions')}
              >
                My Submissions
              </Button>
              <Button
                className={
                  currentStateSelected === 'Following'
                    ? 'btn btn-tabs btn-tabs-selected'
                    : 'btn btn-tabs'
                }
                onClick={() => selectState('Following')}
              >
                Following
              </Button>
            </div>
            {currentStateSelected === 'My Submissions' && (
              <div className='flex flex-column'>
                <StoriesList stories={stories} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MyStories

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'

import Navigation from '../components/Navigation'

import Timeline from '../components/Timeline'

const Story = (props) => {
  const { storyId } = props

  const [story, setStory] = useState('')

  useEffect(() => {
    const fetchStory = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          featureRequest(id: "${storyId}") {
            Title
            Description
            feature_requests_status {
              Status
            }
            user {
              username
            }
            Votes
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setStory(response.data.data.featureRequest)
    }
    fetchStory()
  }, [storyId])

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          {story ? (
            <>
              <Timeline status={story.feature_requests_status.Status} />
              <div className='story-content'>
                <div className='icon-display'>
                  {story.Votes}
                  <i className='eos-icons'>thumb_up</i>
                </div>
                <h3>{story.Title}</h3>
                <p>{story.Description}</p>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

export default Story

import React, { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Button from '../components/Button'
import StoriesList from '../components/StoriesList'

import axios from 'axios'
import { apiURL } from '../config.json'

const stateList = [
  'Under Consideration',
  'Planned',
  'Design in progress',
  'Development in progress',
  'Launched',
  'Testing'
]

const Home = () => {
  const [currentStateSelected, selectState] = useState('Under Consideration')

  const [stories, setStories] = useState([])

  useEffect(() => {
    const fetchStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          featureRequests (sort: "votes:desc,createdAt:desc"){
            id
            Title
            Description
            Votes
            feature_requests_status {
              Status
            }
            feature_request_comments {
              Comments
            }
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.featureRequests)
    }
    fetchStories()
  }, [])

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='home-content'>
            <h3>Welcome to EOS User Stories</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <div className='flex flex-row flex-space-between'>
              {stateList &&
                stateList.map((state, key) => {
                  return (
                    <Button
                      className={
                        currentStateSelected === state
                          ? 'btn btn-tabs btn-tabs-selected'
                          : 'btn btn-tabs'
                      }
                      key={key}
                      onClick={() => selectState(state)}
                    >
                      {state}
                    </Button>
                  )
                })}
            </div>
            <div className='flex flex-column'>
              <StoriesList stories={stories} state={currentStateSelected} />
              {}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

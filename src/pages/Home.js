import React, { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Button from '../components/Button'
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

  const [requests, setRequests] = useState([])

  const strip = (html) => {
    return html.replace(/<\s*[^>]*>/gi, '')
  }

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          featureRequests (sort: "votes:desc,createdAt:desc"){
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
      setRequests(response.data.data.featureRequests)
    }
    fetchRequests()
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
              {requests.map((request, key) => {
                return request.feature_requests_status.Status ===
                  currentStateSelected ? (
                  <div className='request' key={key}>
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
                ) : (
                  ''
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

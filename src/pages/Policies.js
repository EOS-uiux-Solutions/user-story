import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import Navigation from '../components/Navigation'
import ReactMarkdown from 'react-markdown'

const Policies = () => {
  const [policies, setPolicies] = useState('')

  useEffect(() => {
    const fetchPolicies = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
                    userStoryPolicies {
                      Description
                    }
                  }`
        },
        {
          withCredentials: true
        }
      )
      setPolicies(response.data.data.userStoryPolicies[0].Description)
    }
    fetchPolicies()
  }, [])

  return (
    <>
      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper'>
          <ReactMarkdown>{policies && `${policies}`}</ReactMarkdown>
        </div>
      </div>
    </>
  )
}

export default Policies

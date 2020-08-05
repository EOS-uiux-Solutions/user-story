import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import Navigation from '../components/Navigation'

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
    <div className='base-wrapper'>
      <div className='base-container'>
        <Navigation />
        <div className='home-content'>
          <h3>User Story Privacy Policy</h3>
          {policies && <p>{policies}</p>}
        </div>
      </div>
    </div>
  )
}

export default Policies

import React, { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ReactMarkdown from 'react-markdown'
import { Helmet } from 'react-helmet'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import LoadingIndicator from '../modules/LoadingIndicator'
import userStory from '../services/user_story'

const Policies = () => {
  const [policies, setPolicies] = useState('')

  const { promiseInProgress } = usePromiseTracker()

  useEffect(() => {
    const fetchPolicies = async () => {
      const response = await userStory.getPolicies()
      setPolicies(response.data.data.userStoryPolicies?.[0].Description)
    }
    trackPromise(fetchPolicies())
  }, [])

  return (
    <>
      <Helmet>
        <title>Cookie & Privacy Policies | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper'>
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : policies ? (
            <ReactMarkdown>{policies && `${policies}`}</ReactMarkdown>
          ) : (
            <h3>No policies</h3>
          )}
        </div>
      </div>
    </>
  )
}

export default Policies

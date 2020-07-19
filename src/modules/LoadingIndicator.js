import React from 'react'
import { usePromiseTracker } from 'react-promise-tracker'
import Loader from 'react-loader-spinner'

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker()
  return (
    <>
      {promiseInProgress && (
        <div className='loading-indicator'>
          <Loader
            type='ThreeDots'
            color='#D64F13'
            height='100px'
            width='100px'
          />
        </div>
      )}
    </>
  )
}

export default LoadingIndicator

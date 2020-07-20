import React from 'react'
import Loader from 'react-loader-spinner'

const LoadingIndicator = () => {
  return (
    <div className='loading-indicator'>
      <Loader type='ThreeDots' color='#D64F13' height='100px' width='100px' />
    </div>
  )
}

export default LoadingIndicator

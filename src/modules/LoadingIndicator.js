import React from 'react'

const LoadingIndicator = () => {
  return (
    <div className='loading-indicator'>
      <img
        className='loader-image'
        src={require('../assets/images/loading.svg')}
        alt='loader'
      ></img>
    </div>
  )
}

export default LoadingIndicator

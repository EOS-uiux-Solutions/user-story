import React from 'react'
import { ReactComponent as Loader } from '../assets/images/loading.svg'

const LoadingIndicator = () => {
  return (
    <div className='loading-indicator'>
      <Loader className='loader-image' />
    </div>
  )
}

export default LoadingIndicator

import React from 'react'

import Navigation from '../components/Navigation'

export const Home = () => {
  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='newrequest-content'>
            <h3>Welcome to EOS Feature Request</h3>
            <p>DESCRIPTION</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

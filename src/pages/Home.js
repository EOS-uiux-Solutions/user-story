import React from 'react'

import Navigation from '../components/Navigation'

export const Home = () => {
  return (
    <>
      <div className='home-wrapper'>
        <div className='home-container'>
          <Navigation />
          <div className='home-content'>
            <h3>Welcome to EOS Feature Request</h3>
            <p>DESCRIPTION</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

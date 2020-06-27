import React, { useState } from 'react'

import Navigation from '../components/Navigation'
import Button from '../components/Button'

const stateList = [
  'New',
  'Under Review',
  'Planned',
  'Under Development',
  'Published'
]
// to be replaced by a fetch request

export const Home = () => {
  const [currentStateSelected, selectState] = useState('New')
  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='home-content'>
            <h3>Welcome to EOS Feature Request</h3>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

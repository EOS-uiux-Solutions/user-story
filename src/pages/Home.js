import React, { useState } from 'react'

import Navigation from '../components/Navigation'
import Button from '../components/Button'

const stateList = [
  'Under Consideration',
  'Planned',
  'Design in progress',
  'Development in progress',
  'Launched',
  'Testing'
]
// to be replaced by a fetch request

const requestsList = [
  {
    requestName: 'Story 1',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
    state: 'Under Consideration',
    votes: 50,
    comments: 23
  },
  {
    requestName: 'Story 2',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
    state: 'Launched',
    votes: 23,
    comments: 5
  }
]

export const Home = () => {
  const [currentStateSelected, selectState] = useState('Under Consideration')
  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='home-content'>
            <h3>Welcome to EOS User Stories</h3>
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
            <div className='flex flex-column'>
              {requestsList.map((request, key) => {
                return request.state === currentStateSelected ? (
                  <div className='request' key={key}>
                    <div className='request-content'>
                      <h4>{request.requestName}</h4>
                      {request.description}
                    </div>
                    <div className='icon-display'>
                      {request.votes}
                      <i className='eos-icons'>thumb_up</i>
                    </div>
                    <div className='icon-display'>
                      {request.comments}
                      <i className='eos-icons'>comment</i>
                    </div>
                  </div>
                ) : (
                  ''
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

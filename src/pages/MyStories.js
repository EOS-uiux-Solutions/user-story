import React, { useState, useContext } from 'react'
import { Helmet } from 'react-helmet'

import Button from '../components/Button'
import Navigation from '../components/Navigation'

import Context from '../modules/Context'
import Login from './Login'

import Stories from '../components/Stories'

const MyStories = () => {
  const { state } = useContext(Context)

  const [currentStateSelected, selectState] = useState('My Submissions')

  const id = localStorage.getItem('id')

  return state.auth ? (
    <>
      <Helmet>
        <title>My stories | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper my-stories'>
          <h2>My Stories</h2>
          <div className='flex flex-row roadmap-one'>
            <Button
              className={`btn btn-default
                ${
                  currentStateSelected === 'My Submissions'
                    ? 'btn btn-tabs btn-tabs-selected'
                    : 'btn btn-tabs'
                }
              `}
              onClick={() => selectState('My Submissions')}
            >
              My Submissions
            </Button>
            &nbsp; &nbsp;
            <Button
              className={`btn btn-default
                ${
                  currentStateSelected === 'Following'
                    ? 'btn btn-tabs btn-tabs-selected'
                    : 'btn btn-tabs'
                }
              `}
              onClick={() => selectState('Following')}
            >
              Following
            </Button>
          </div>

          <Stories
            authorId={currentStateSelected === 'My Submissions' ? id : null}
            followerId={currentStateSelected === 'Following' ? id : null}
          />
        </div>
      </div>
    </>
  ) : (
    <Login message='Please login to access your stories' />
  )
}

export default MyStories

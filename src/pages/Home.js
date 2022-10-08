import React, { useState, useEffect, useContext } from 'react'
import { Link } from '@reach/router'
import { Helmet } from 'react-helmet'

import Stories from '../components/Stories'
import Navigation from '../components/Navigation'
import Modal from '../components/Modal'

import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'
import userStory from '../services/user_story'

const Home = () => {
  const { logout } = useAuth()

  const userId = localStorage.getItem('id')

  const { dispatch } = useContext(Context)

  const [modal, setModal] = useState(false)

  const [policyUpdate, setPolicyUpdate] = useState()

  useEffect(() => {
    const fetchPolicyNotifications = async () => {
      const response = await userStory.getPolicyNotifications()
      if (response.data.data.userStoryNotifications) {
        const seenBy = response.data.data.userStoryNotifications[0]?.seenBy.map(
          (seen) => seen.id
        )
        if (
          response.data.data.userStoryNotifications.length &&
          !seenBy.includes(userId)
        ) {
          setModal(true)
          setPolicyUpdate(response.data.data.userStoryNotifications[0])
        }
      }
    }
    if (userId) {
      fetchPolicyNotifications()
    }
  }, [userId])

  const acceptUpdatedPolicy = async () => {
    const seenBy = policyUpdate.seenBy.map((seen) => seen.id)
    seenBy.push(userId)
    await userStory.markNotificationAsRead(policyUpdate.id, seenBy)
    setModal(false)
  }

  const handlePolicyUpdateReject = async () => {
    if (userId) {
      await logout()
      dispatch({
        type: 'DEAUTHENTICATE'
      })
    }
    setModal(false)
  }

  return (
    <>
      <Helmet>
        <title>Home | EOS User story</title>
        <meta
          name='description'
          content="Share with us how you use our products, relate to other users stories, vote them up, and we'll make sure we deliver cohesive solutions that enhance your experience."
        />
        <meta
          name='keywords'
          content='feature request, open roadmap, user voice, feature request tracking, issue tracker open source '
        />
      </Helmet>

      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper'>
          <div className='product-introduction'>
            <div>
              <h1 data-cy='dashboard-heading'>TELL US YOUR STORY</h1>
              <h2 className='subheader'>
                Share with us how you use our products, relate to other users'
                stories, vote them up, and we'll make sure we deliver cohesive
                solutions that enhance your experience.
              </h2>
            </div>
          </div>
          <Stories userId={userId} />
        </div>
      </div>
      {modal && policyUpdate ? (
        <Modal
          showButtons={true}
          onCancel={handlePolicyUpdateReject}
          isActive={modal}
          show={() => setModal(false)}
          onOk={acceptUpdatedPolicy}
        >
          {
            <>
              {policyUpdate.message}
              <Link className='link link-default' to={`/${policyUpdate.link}`}>
                View privacy policy
              </Link>
            </>
          }
        </Modal>
      ) : (
        ''
      )}
    </>
  )
}

export default Home

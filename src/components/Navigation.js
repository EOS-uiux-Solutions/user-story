import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, navigate } from '@reach/router'

import eosIcon from '../assets/images/logo-coloured.png'
import useAuth from '../hooks/useAuth'
import axios from 'axios'
import { apiURL } from '../config.json'
import Context from '../modules/Context'

const Navigation = (props) => {
  const { logout } = useAuth()

  const userId = localStorage.getItem('id')
  const userName = localStorage.getItem('name')
  const userEmail = localStorage.getItem('email')

  const { state, dispatch } = useContext(Context)

  const [notifications, setNotifications] = useState([])

  const [notificationsDropdownState, setNotificationsDropdownState] = useState(
    false
  )

  const [userDropdownState, setUserDropdownState] = useState(false)

  const notificationsDropdownContainer = useRef()
  const userDropdownContainer = useRef()

  useEffect(() => {
    if (props.policyUpdateRejected) {
      dispatch({
        type: 'DEAUTHENTICATE'
      })
    }
  }, [props.policyUpdateRejected, dispatch])

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          userStoryNotifications (where: {
            users: {
              id: "${userId}"
            }
          }){
            message
            id
            users {
              id
            }
            seenBy {
              id
            }
            date
            link
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      setNotifications(response.data.data.userStoryNotifications)
    }
    fetchNotifications()
  }, [userId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsDropdownContainer.current &&
        !notificationsDropdownContainer.current.contains(event.target)
      ) {
        setNotificationsDropdownState(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsDropdownContainer])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownContainer.current &&
        !userDropdownContainer.current.contains(event.target)
      ) {
        setUserDropdownState(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userDropdownContainer])

  const updateNotifications = () => {
    setNotificationsDropdownState(!notificationsDropdownState)
    if (notifications) {
      notifications.forEach(async (notification) => {
        const seenBy = notification.seenBy.map((seen) => seen.id)
        if (!seenBy.includes(userId)) {
          seenBy.push(userId)
          await axios.post(
            `${apiURL}/graphql`,
            {
              query: `mutation updateNotifications($seenBy: [ID]){
            updateUserStoryNotification(input: {
              where: {
                id: "${notification.id}"
              }
              data: {
                seenBy: $seenBy
              }
            }) {
              userStoryNotification {
                id
              }
            }
          }`,
              variables: {
                seenBy: seenBy
              }
            },
            {
              withCredentials: true
            }
          )
        }
      })
    }
  }

  const handleLogout = async () => {
    await logout()
    dispatch({
      type: 'DEAUTHENTICATE'
    })
    navigate('/')
  }

  return (
    <header className='nav-header'>
      <Link className='link' to='/'>
        <div className='flex flex-column brand'>
          <img className='logo' src={eosIcon} alt='' />
          <span className='brand-text'>USER STORIES</span>
        </div>
      </Link>
      <nav>
        {state.auth && (
          <Link className='link link-nav' to='/newStory'>
            + New Story
          </Link>
        )}
        {!state.auth && (
          <Link className='link link-nav' to='/login'>
            Sign In
          </Link>
        )}
        {state.auth && (
          <div
            className='dropdown-container'
            onClick={updateNotifications}
            ref={notificationsDropdownContainer}
          >
            <i
              className={`eos-icons ${
                notificationsDropdownState ? 'eos-icons-open' : ''
              }`}
            >
              notifications
            </i>
            <div
              className={`dropdown nav-dropdown ${
                notificationsDropdownState
                  ? 'dropdown-open dropdown-left'
                  : 'dropdown-close dropdown-left'
              }`}
            >
              <ul className='dropdown-list'>
                {notifications
                  ? notifications.map((notification, key) => (
                      <li
                        className='dropdown-element'
                        onClick={() => navigate(`/${notification.link}`)}
                        key={key}
                      >
                        {notification.message}
                        <hr className='dropdown-separator' />
                      </li>
                    ))
                  : ''}
              </ul>
              <div className='flex flex-row flex-space-between notifications-options'>
                {notifications.length > 0 ? (
                  <>
                    <Link className='link link-default' to='#'>
                      Mark all as read
                    </Link>
                    <Link className='link link-default' to='/notifications'>
                      View all
                    </Link>
                  </>
                ) : (
                  'No notifications at the moment'
                )}
              </div>
            </div>
          </div>
        )}
        {state.auth && (
          <div
            className='dropdown-container'
            onClick={() => {
              setUserDropdownState(!userDropdownState)
            }}
            ref={userDropdownContainer}
          >
            <i
              className={`eos-icons ${
                userDropdownState ? 'eos-icons-open' : ''
              }`}
            >
              person
            </i>
            <div
              className={`dropdown nav-dropdown ${
                userDropdownState
                  ? 'dropdown-open dropdown-left'
                  : 'dropdown-close dropdown-left'
              }`}
            >
              <ul className='dropdown-list'>
                <li className='user-dropdown user-dropdown-name'>{userName}</li>
                <li className='user-dropdown user-dropdown-email'>
                  {userEmail}
                </li>
                <hr className='dropdown-separator' />
                <li
                  className='dropdown-element'
                  onClick={() => navigate('/myStories')}
                >
                  <i className='eos-icons'>message</i>
                  My Stories
                </li>
                <li
                  className='dropdown-element'
                  onClick={() => navigate('/myProfile')}
                >
                  <i className='eos-icons'>settings</i>
                  My Account
                </li>
                <hr className='dropdown-separator' />
                <li className='dropdown-element' onClick={handleLogout}>
                  <i className='eos-icons'>exit_to_app</i>
                  Log Out
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navigation

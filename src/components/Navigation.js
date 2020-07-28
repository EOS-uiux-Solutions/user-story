import React, { useState, useEffect, useRef } from 'react'
import { Link, navigate } from '@reach/router'
import eosIcon from '../assets/images/logo-white.png'
import useAuth from '../hooks/useAuth'
import axios from 'axios'
import { apiURL } from '../config.json'

const Navigation = () => {
  const { logout } = useAuth()

  const userId = localStorage.getItem('id')

  const [state, setState] = useState(localStorage.getItem('status'))

  const [notifications, setNotifications] = useState([])

  const [updateSeenStatus, setSeenStatus] = useState(false)

  const [notificationsDropdownState, setNotificationsDropdownState] = useState(
    false
  )

  const [userDropdownState, setUserDropdownState] = useState(false)

  const notificationsDropdownContainer = useRef()
  const userDropdownContainer = useRef()

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
  }, [userId, updateSeenStatus])

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
    setTimeout(() => setSeenStatus(true), 4000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setState('Public')
  }

  return (
    <header className='nav-header'>
      <Link className='link link-light' to='/'>
        <div className='brand'>
          <img className='logo' src={eosIcon} alt='' />
          <span className='brand-text'>USER STORIES</span>
        </div>
      </Link>
      <nav>
        {state === 'Authenticated' && (
          <Link className='link link-light' to='/newStory'>
            NEW STORY
          </Link>
        )}
        {state !== 'Authenticated' && (
          <Link className='link link-light' to='/login'>
            SIGN IN
          </Link>
        )}
        {state === 'Authenticated' && (
          <div
            className='dropdown-container'
            onClick={updateNotifications}
            ref={notificationsDropdownContainer}
          >
            <i className='eos-icons'>notifications</i>
            <div
              className={`dropdown ${
                notificationsDropdownState ? 'dropdown-open' : 'dropdown-close'
              }`}
            >
              <h4>Notfications</h4>
              <ul>
                {notifications
                  ? notifications.map((notification, key) => (
                      <li key={key}>{notification.message}</li>
                    ))
                  : ''}
              </ul>
            </div>
          </div>
        )}
        {state === 'Authenticated' && (
          <div
            className='dropdown-container'
            onClick={() => {
              setUserDropdownState(!userDropdownState)
            }}
            ref={userDropdownContainer}
          >
            <i className='eos-icons'>person</i>
            <div
              className={`dropdown ${
                userDropdownState ? 'dropdown-open' : 'dropdown-close'
              }`}
            >
              <ul>
                <li>
                  <Link className='link link-light' to='/myStories'>
                    MY STORIES
                  </Link>
                </li>
                <li>
                  <Link className='link link-light' to='/myProfile'>
                    MY PROFILE
                  </Link>
                </li>
                <li onClick={handleLogout}>
                  <Link className='link link-light' to='#'>
                    LOG OUT
                  </Link>
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

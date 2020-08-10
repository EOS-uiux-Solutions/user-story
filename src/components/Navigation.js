import React, { useState, useEffect, useRef } from 'react'
import { Link, navigate } from '@reach/router'
import eosIcon from '../assets/images/logo-white.png'
import useAuth from '../hooks/useAuth'
import axios from 'axios'
import { apiURL } from '../config.json'

const Navigation = (props) => {
  const { logout } = useAuth()

  const userId = localStorage.getItem('id')

  const [state, setState] = useState(localStorage.getItem('status'))

  const [notifications, setNotifications] = useState([])

  const [notificationsDropdownState, setNotificationsDropdownState] = useState(
    false
  )

  const [userDropdownState, setUserDropdownState] = useState(false)

  const notificationsDropdownContainer = useRef()
  const userDropdownContainer = useRef()

  useEffect(() => {
    if (props.policyUpdateRejected) {
      setState('Public')
    }
  }, [props.policyUpdateRejected])

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
                notificationsDropdownState
                  ? 'dropdown-open dropdown-left'
                  : 'dropdown-close dropdown-left'
              }`}
            >
              <h4>Notfications</h4>
              <ul className='dropdown-list'>
                {notifications
                  ? notifications.map((notification, key) => (
                      <Link to={`/${notification.link}`} key={key}>
                        <li>{notification.message}</li>
                      </Link>
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
                userDropdownState
                  ? 'dropdown-open dropdown-left'
                  : 'dropdown-close dropdown-left'
              }`}
            >
              <ul className='dropdown-list'>
                <li
                  className='dropdown-element'
                  onClick={() => navigate('/myStories')}
                >
                  <Link className='link link-light' to='#'>
                    MY STORIES
                  </Link>
                </li>
                <li
                  className='dropdown-element'
                  onClick={() => navigate('/myProfile')}
                >
                  <Link className='link link-light' to='#'>
                    MY PROFILE
                  </Link>
                </li>
                <li className='dropdown-element' onClick={handleLogout}>
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

import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { Link, navigate } from '@reach/router'
import { apiURL } from '../config.json'
import Context from '../modules/Context'

const Notifications = () => {
  const userId = localStorage.getItem('id')

  const { state } = useContext(Context)

  const [notifications, setNotifications] = useState([])

  const [notificationsDropdownState, setNotificationsDropdownState] = useState(
    false
  )

  const [notificationCount, setNotificationCount] = useState(0)

  const [notificationsSeen, setNotificationsSeen] = useState(false)

  const notificationsDropdownContainer = useRef()

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
      let calculateNotifications = 0
      response.data.data.userStoryNotifications.forEach((notification) => {
        const seenBy = notification.seenBy.map((seen) => seen.id)
        if (!seenBy.includes(userId)) {
          calculateNotifications++
        }
      })
      setNotificationCount(calculateNotifications)
    }
    fetchNotifications()
  }, [userId, notificationsSeen])

  const updateNotifications = () => {
    setNotificationsDropdownState(!notificationsDropdownState)
    if (notifications) {
      notifications.forEach(async (notification) => {
        const seenBy = notification.seenBy.map((seen) => seen.id)
        if (!seenBy.includes(userId)) {
          setTimeout(() => setNotificationsSeen(true), 3000)
          if (notificationCount !== 0)
            setNotificationCount((notificationCount) => notificationCount - 1)
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

  return (
    state.auth && (
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
        <span className='notifications-count'>
          {' '}
          {notificationCount > 0 ? notificationCount : ''}
        </span>
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
            {notifications && notifications.length > 0 ? (
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
    )
  )
}

export default Notifications

import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, navigate } from '@reach/router'
import Context from '../modules/Context'
import userStory from '../services/user_story'

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
      const response = await userStory.getNotificationsByUserId(userId)
      let unseenNotifications = []
      if (response.data.data.userStoryNotifications) {
        unseenNotifications = response.data.data.userStoryNotifications
        unseenNotifications = unseenNotifications.filter((notification) => {
          const seenBy = notification.seenBy.map((seen) => seen.id)
          return !seenBy.includes(userId)
        })
      }
      setNotifications(unseenNotifications)
      setNotificationCount(unseenNotifications.length)
    }
    if (userId) {
      fetchNotifications()
    }
  }, [userId, notificationsSeen])

  const markAllNotificationsAsRead = () => {
    if (notifications) {
      notifications.forEach(async (notification) => {
        const seenBy = notification.seenBy.map((seen) => seen.id)
        if (!seenBy.includes(userId)) {
          seenBy.push(userId)
          await userStory.markNotificationAsRead(notification.id, seenBy)
          setNotifications([])
          setNotificationCount(0)
          setNotificationsSeen(false)
        }
      })
    }
  }

  return (
    state.auth && (
      <div
        className='dropdown-container'
        onClick={() => {
          setNotificationsDropdownState(!notificationsDropdownState)
          setNotificationsSeen(true)
        }}
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
          {!notificationsSeen && notificationCount > 0 ? notificationCount : ''}
        </span>
        <div
          className={`dropdown notifications-dropdown ${
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
                <Link
                  className='link link-default'
                  to='#'
                  onClick={markAllNotificationsAsRead}
                >
                  Mark all as read
                </Link>
              </>
            ) : (
              'No new notifications at the moment'
            )}
            <>
              <Link className='link link-default' to='/notifications'>
                View all
              </Link>
            </>
          </div>
        </div>
      </div>
    )
  )
}

export default Notifications

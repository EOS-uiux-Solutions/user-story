import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { apiURL } from '../config.json'
import LoadingIndicator from '../modules/LoadingIndicator'

const UsersSuggestionDropdown = ({
  isOpen,
  userTerm,
  setUserTerm,
  setUserQuery,
  setUsersSuggestionOpen
}) => {
  const [usersToSuggest, setUsersToSuggest] = useState([])

  const { promiseInProgress } = usePromiseTracker({
    area: 'user-suggest-dropdown'
  })

  const dropDown = useRef(null)

  const cancelToken = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDown.current && !dropDown.current.contains(event.target)) {
        setUsersSuggestionOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setUsersSuggestionOpen])

  useEffect(() => {
    if (userTerm.length <= 0) {
      setUsersSuggestionOpen(false)
      return
    }

    if (typeof cancelToken.current !== typeof undefined) {
      cancelToken.current.cancel()
    }

    cancelToken.current = axios.CancelToken.source()

    const fetchUsers = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            users (where: {
              username_contains: "${userTerm}"
            }) {
              id
              username
              profilePicture {
                url
              }
            }
          }`
        },
        { cancelToken: cancelToken.current.token }
      )
      setUsersToSuggest(response.data.data?.users ?? [])
    }
    if (userTerm.length > 0) {
      trackPromise(fetchUsers(), 'user-suggest-dropdown')
    } else {
      setUsersToSuggest([])
    }
  }, [userTerm, setUsersSuggestionOpen])

  if (!isOpen) {
    return null
  }
  return (
    <div
      ref={dropDown}
      className='flex flex-center dropdown user-suggest-dropdown'
    >
      {promiseInProgress ? (
        <LoadingIndicator />
      ) : usersToSuggest.length > 0 ? (
        <ul className='dropdown-list'>
          {usersToSuggest.map((user) => (
            <li
              key={user.id}
              onClick={() => {
                setUserTerm(user.username)
                setUserQuery(user.username)
                setUsersSuggestionOpen(false)
              }}
              className='user-data'
            >
              <div className='user-row flex flex-space-between flex-align-center'>
                <img
                  className='avatar'
                  src={
                    user?.profilePicture?.url ??
                    `https://avatars.dicebear.com/api/jdenticon/${user.username}.svg`
                  }
                  alt='Default User Avatar'
                ></img>
                <span>{user.username}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  )
}

export default UsersSuggestionDropdown

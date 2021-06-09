import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'

const UsersSuggestionDropdown = ({
  isOpen,
  userTerm,
  setUserTerm,
  setUserQuery,
  setUsersSuggestionOpen
}) => {
  const [usersToSuggest, setUsersToSuggest] = useState([])

  const dropDown = useRef(null)

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
    const fetchUsers = async () => {
      const response = await axios.post(`${apiURL}/graphql`, {
        query: `query {
          users (where: {
            username_contains: "${userTerm}"
          }) {
            id
            username
          }
        }`
      })
      setUsersToSuggest(response.data.data.users)
    }
    if (userTerm.length > 0) {
      fetchUsers()
    } else {
      setUsersToSuggest([])
    }
  }, [userTerm, setUsersSuggestionOpen])

  if (!isOpen) {
    return null
  }
  return (
    <div ref={dropDown} className='dropdown nav-dropdown user-suggest-dropdown'>
      <div>
        {usersToSuggest.length > 0 ? (
          <ul>
            {usersToSuggest.map((u) => (
              <li
                key={u.id}
                onClick={() => {
                  setUserTerm(u.username)
                  setUserQuery(u.username)
                  setUsersSuggestionOpen(false)
                }}
              >
                {u.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  )
}

export default UsersSuggestionDropdown

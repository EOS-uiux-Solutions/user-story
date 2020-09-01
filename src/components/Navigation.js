import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, navigate } from '@reach/router'

import eosIcon from '../assets/images/user-story-logo.svg'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'
import Notifications from './Notifications'

const Navigation = (props) => {
  const { logout } = useAuth()

  const userName = localStorage.getItem('username')
  const userEmail = localStorage.getItem('email')

  const { state, dispatch } = useContext(Context)

  const [userDropdownState, setUserDropdownState] = useState(false)

  const userDropdownContainer = useRef()

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
        <img className='logo' src={eosIcon} alt='' />
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
        <Notifications />
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
              account_circle
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

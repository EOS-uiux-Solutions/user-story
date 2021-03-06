/* eslint-disable no-var */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, navigate } from '@reach/router'
import {
  EOS_ACCOUNT_CIRCLE,
  EOS_MESSAGE,
  EOS_SETTINGS,
  EOS_EXIT_TO_APP
} from 'eos-icons-react'
import toast from 'react-hot-toast'
import eosIcon from '../assets/images/user-story-logo.svg'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'
import Notifications from './Notifications'
import Button from './Button'
import { useOktaAuth } from '@okta/okta-react'
const { SSO } = require('../config.json')

const Navigation = (props) => {
  const { login, logout } = useAuth()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (SSO) var { authState } = useOktaAuth()

  const userName = SSO
    ? authState?.idToken?.claims?.preferred_username
    : localStorage.getItem('username')
  const userEmail = SSO
    ? authState?.idToken?.claims?.email
    : localStorage.getItem('email')

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

  const handleLogin = () => {
    if (SSO) login()
    else navigate('/login')
  }

  const handleLogout = async () => {
    await logout()
    dispatch({
      type: 'DEAUTHENTICATE'
    })
    toast.success('You are now logged out of the application')
    navigate('/')
  }

  useEffect(() => {
    if (SSO) {
      if (authState && authState.isAuthenticated) {
        dispatch({
          type: 'AUTHENTICATE'
        })
      } else {
        dispatch({
          type: 'DEAUTHENTICATE'
        })
      }
    }
  }, [authState, dispatch])

  return (
    <header className='nav-header'>
      <Link className='link' data-cy='nav-eos-logo' to='/'>
        <img className='logo' src={eosIcon} alt='' />
      </Link>
      <nav className='navbar-content flex flex-row'>
        {state.auth && (
          <Link
            className='btn btn-default'
            data-cy='btn-new-story'
            to='/newStory'
          >
            + New Story
          </Link>
        )}
        {!state.auth && (
          <Button
            className='btn btn-default'
            data-cy='btn-signin'
            onClick={handleLogin}
          >
            Sign In
          </Button>
        )}
        <Notifications />
        {state.auth && (
          <div
            className='dropdown-container'
            data-cy='user-dropdown-menu-btn'
            onClick={() => {
              setUserDropdownState(!userDropdownState)
            }}
            ref={userDropdownContainer}
          >
            <EOS_ACCOUNT_CIRCLE
              className={`eos-icons icon-dropdown ${
                userDropdownState ? 'open' : ''
              }`}
            />
            <div
              className={`dropdown nav-dropdown ${
                userDropdownState
                  ? 'dropdown-open dropdown-left'
                  : 'dropdown-close dropdown-left'
              }`}
            >
              <ul className='dropdown-list nav-dropdown-list'>
                <li className='user-dropdown user-dropdown-name'>{userName}</li>
                <li className='user-dropdown user-dropdown-email'>
                  {userEmail}
                </li>
                <hr className='dropdown-separator' />
                <li
                  className='dropdown-element'
                  data-cy='user-stories-btn'
                  onClick={() => navigate('/myStories')}
                >
                  <EOS_MESSAGE className='eos-icons eos-18' />
                  My Stories
                </li>
                <li
                  className='dropdown-element'
                  data-cy='user-profile-btn'
                  onClick={() => navigate('/myProfile')}
                >
                  <EOS_SETTINGS className='eos-icons eos-18' />
                  My Account
                </li>
                <hr className='dropdown-separator' />
                <li className='dropdown-element' onClick={handleLogout}>
                  <EOS_EXIT_TO_APP className='eos-icons eos-18' />
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

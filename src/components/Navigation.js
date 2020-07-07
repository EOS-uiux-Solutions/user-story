import React, { useState } from 'react'
import { Link, navigate } from '@reach/router'
import eosIcon from '../assets/images/logo-white.png'
import useAuth from '../hooks/useAuth'

const Navigation = () => {
  const { logout } = useAuth()

  const [state, setState] = useState(localStorage.getItem('status'))

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
          <div className='dropdown-container'>
            <i className='eos-icons'>person</i>
            <div className='dropdown dropdown-nodisplay'>
              <ul>
                <li>
                  <Link className='link link-light' to='/myStories'>
                    MY STORIES
                  </Link>
                </li>
                <li>
                  <Link className='link link-light' to='/login'>
                    MY ACCOUNT
                  </Link>
                </li>
                <li>
                  <Link className='link link-light' to='/login'>
                    ADMIN PANEL
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

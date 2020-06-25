import React, { useState } from 'react'
import { Link } from '@reach/router'
import eosIcon from '../assets/images/logo-white.png'
import useAuth from '../hooks/useAuth'

import Button from './Button'

const Navigation = () => {
  const { logout } = useAuth()

  const [state, setState] = useState(localStorage.getItem('status'))

  const handleLogout = () => {
    logout()
    setState('public')
  }

  return (
    <header className='nav-header'>
      <Link className='link link-light' to='/'>
        <div className='brand'>
          <img className='logo' src={eosIcon} alt='' />
          <span className='brand-text'>FEATURE REQUEST</span>
        </div>
      </Link>
      <nav>
        {state === 'Authenticated' && (
          <Link className='link link-light' to='/newRequest'>
            MAKE A REQUEST
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
                <li>MY ACCOUNT</li>
                <li>ADMIN PANEL</li>
                <li>
                  <Button onClick={handleLogout}>LOG OUT</Button>
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

import React from 'react'
import { Link } from '@reach/router'
import eosIcon from '../assets/images/logo-white.png'

const Navigation = () => {
  return (
    <header className='nav-header'>
      <Link className='link link-light' to='/'>
        <div className='brand'>
          <img className='logo' src={eosIcon} alt='' />
          <span className='brand-text'>FEATURE REQUEST</span>
        </div>
      </Link>
      <nav>
        {localStorage.getItem('status') === 'Authenticated' && (
          <Link className='link link-light' to='/'>
            MAKE A REQUEST
          </Link>
        )}
        {localStorage.getItem('status') !== 'Authenticated' && (
          <Link className='link link-light' to='/login'>
            SIGN IN
          </Link>
        )}
        {localStorage.getItem('status') === 'Authenticated' && (
          <div className='dropdown-container'>
            <i className='eos-icons'>person</i>
            <div className='dropdown dropdown-nodisplay'>
              <ul>
                <li>MY ACCOUNT</li>
                <li>ADMIN PANEL</li>
                <li>LOG OUT</li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navigation

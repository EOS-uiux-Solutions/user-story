import React, { useState, useEffect, useContext } from 'react'

import { Link, navigate } from '@reach/router'
import { AuthContext } from '../utils/AuthContext'
import { useTranslation } from 'react-i18next'

import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'

export const Register = () => {
  const { isAuthenticated, register } = useContext(AuthContext)
  const { t, i18n } = useTranslation()
  useEffect(() => {
    localStorage.setItem('ce4vtV3pgy#4uDvx', JSON.stringify(isAuthenticated))
  }, [isAuthenticated])

  const initialFormState = {
    username: '',
    email: '',
    password: ''
  }

  const [data, setData] = useState(initialFormState)

  const [error, setError] = useState('')

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await register({
        username: data.username,
        email: data.email,
        password: data.password
      })
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className='authentication-wrapper'>
      <div className='authentication'>
        <div className='container-left'>
          <div>
            <div className='image image-logo'>
              <img src={eosLogoWhite} alt='EOS Logo' />
            </div>
            <div className='image image-center'>
              <img src={eosLock} alt='EOS Logo' />
            </div>
            <div>
              <div className='header'>{t('authentication:header-left')}</div>
              <p>{t('authentication:feature-request-description')}</p>
            </div>
          </div>
          <div className='footer'>{t('authentication:footer-left')}</div>
        </div>
        <div className='container-right'>
          <div className='flex-row'>
            <div className='image image-logo eos-logo-resize'>
              <img src={eosLogoColoured} alt='EOS Logo' />
            </div>
            <Dropdown translator={i18n} />
          </div>
          <div>
            <form className='form' onSubmit={handleSubmit}>
              <div className='header'>{t('authentication:title-sign-up')}</div>
              <div className='form-group'>
                <label htmlFor='username'>
                  {t('authentication:username-label')}
                </label>
                <input
                  type='text'
                  name='username'
                  onChange={handleInputChange}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='email'>{t('authentication:email-label')}</label>
                <input type='text' name='email' onChange={handleInputChange} />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>
                  {t('authentication:password-label')}
                </label>
                <input
                  type='password'
                  name='password'
                  onChange={handleInputChange}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>
                  {t('authentication:confirm-password-label')}
                </label>
                <input
                  type='password'
                  name='password'
                  onChange={handleInputChange}
                />
              </div>
              <Button type='submit' className='btn btn-default'>
                {t('authentication:register-label')}
              </Button>
              {error && <span className='form-error'>{error}</span>}
            </form>
            <Link to='/login'>{t('authentication:existing-user')}</Link>
          </div>
          <div className='footer'>
            <span> {t('authentication:footer-right')} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

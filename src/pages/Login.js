import React, { useState } from 'react'

import { Link, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth'

import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'

export const Login = () => {
  const { t, i18n } = useTranslation()

  const { login } = useAuth()

  const initialState = {
    identifier: '',
    password: ''
  }

  const [data, setData] = useState(initialState)

  const [error, setError] = useState('')

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    try {
      await login({
        identifier: data.identifier,
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
            <form className='form' onSubmit={handleFormSubmit}>
              <div className='header'>{t('authentication:title-sign-in')}</div>
              <div className='form-group'>
                <label htmlFor='identifer'>
                  {t('authentication:username-label')}
                </label>
                <input
                  type='text'
                  name='identifier'
                  onChange={handleInputChange}
                />
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
              <Button
                type='submit'
                className='btn btn-default'
                disabled={data.isSubmitting}
              >
                {t('authentication:login-label')}
              </Button>
              {error && <span className='form-error'>{error}</span>}
            </form>
            <div className='flex-row'>
              <Link to='/forgotPassword'>
                {t('authentication:forgot-password')}
              </Link>
              <Link to='/register'>{t('authentication:create-account')}</Link>
            </div>
          </div>
          <div className='footer'>
            <span> {t('authentication:footer-right')} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

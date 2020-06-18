import React, { useState } from 'react'
import { Link, useLocation } from '@reach/router'
import { useTranslation } from 'react-i18next'

import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import useAuth from '../hooks/useAuth'

const ResetPassword = () => {
  const { t, i18n } = useTranslation()

  const { resetPassword } = useAuth()

  const location = useLocation()

  const initialState = {
    code: '',
    password: '',
    passwordConfirmation: ''
  }

  const [data, setData] = useState(initialState)

  const [error, setError] = useState('')

  const [response, setResponse] = useState('')

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    try {
      const reply = await resetPassword({
        code: location.search.slice(6),
        password: data.password,
        passwordConfirmation: data.passwordConfirmation
      })
      setResponse(reply)
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
            {response ? (
              <>
                <div className='header'>
                  {t('authentication:forgot-password')}
                </div>
                <p>Your password has been reset.</p>
                <div className='flex-row'>
                  <Link to='/login'>
                    {t('authentication:reset-password-done')}
                  </Link>
                </div>
              </>
            ) : (
              <form className='form' onSubmit={handleFormSubmit}>
                <div className='header'>
                  {t('authentication:reset-password')}
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>
                    {t('authentication:new-password')}
                  </label>
                  <input
                    type='password'
                    name='password'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='confirm-password'>
                    {t('authentication:confirm-password')}
                  </label>
                  <input
                    type='password'
                    name='passwordConfirmation'
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  type='submit'
                  className='btn btn-default'
                  disabled={data.isSubmitting}
                >
                  {t('authentication:submit-label')}
                </Button>
                {error && <span className='form-error'>{error}</span>}
              </form>
            )}
          </div>
          <div className='footer'>
            <span>{t('authentication:footer-right')} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword

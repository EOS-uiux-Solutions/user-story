import React, { useState } from 'react'
import { Link, navigate } from '@reach/router'
import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import useAuth from '../hooks/useAuth'
import Dropdown from '../components/Dropdown'
import { useTranslation } from 'react-i18next'

export const Register = () => {
  const { register } = useAuth()

  const { t, i18n } = useTranslation()

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
      const payload = await register({
        username: data.username,
        email: data.email,
        password: data.password
      })
      localStorage.setItem('status', payload.status)
      localStorage.setItem('id', payload.user.id)
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
          <div className='flex flex-row flex-space-between'>
            <div className='image image-logo eos-logo-resize'>
              <img src={eosLogoColoured} alt='EOS Logo' />
            </div>
            <Dropdown translator={i18n} />
          </div>
          <div>
            <form className='form-default' onSubmit={handleSubmit}>
              <div className='header'>{t('authentication:title-sign-up')}</div>
              <label htmlFor='username'>
                {t('authentication:username-label')}
              </label>
              <input
                className='input-default'
                type='text'
                name='username'
                onChange={handleInputChange}
              />
              <label htmlFor='email'>{t('authentication:email-label')}</label>
              <input
                className='input-default'
                type='text'
                name='email'
                onChange={handleInputChange}
              />
              <label htmlFor='password'>
                {t('authentication:password-label')}
              </label>
              <input
                className='input-default'
                type='password'
                name='password'
                onChange={handleInputChange}
              />
              <label htmlFor='password'>
                {t('authentication:confirm-password-label')}
              </label>
              <input
                className='input-default'
                type='password'
                name='password'
                onChange={handleInputChange}
              />
              <Button type='submit' className='btn btn-default'>
                {t('authentication:register-label')}
              </Button>
              {error && <span className='form-error'>{error}</span>}
            </form>
            <Link className='link link-default' to='/login'>
              {t('authentication:existing-user')}
            </Link>
          </div>
          <div className='footer'>
            <i className='eos-icons'>copyright</i>
            <span> {t('authentication:footer-right')} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

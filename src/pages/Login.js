import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Link, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth'

import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import FormError from '../components/FormError'

export const Login = () => {
  const { t, i18n } = useTranslation()

  const { login } = useAuth()

  const { register, handleSubmit, errors } = useForm()

  const [error, setError] = useState('')

  const [showPassword, toggleShowPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      const payload = await login({
        identifier: data.identifier,
        password: data.password
      })
      localStorage.setItem('status', payload.status)
      localStorage.setItem('id', payload.user.id)
      localStorage.setItem('name', payload.user.Name)
      localStorage.setItem('email', payload.user.email)
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
              <p>{t('authentication:user-stories-description')}</p>
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
            <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
              <div className='header'>{t('authentication:title-sign-in')}</div>
              <div className='form-element'>
                <label htmlFor='identifer'>
                  {t('authentication:username-label')}
                </label>
                <input
                  className='input-default'
                  type='text'
                  name='identifier'
                  ref={register({ required: true })}
                />
                {errors.identifier && (
                  <FormError type={errors.identifier.type} />
                )}
              </div>

              <div className='form-element'>
                <label htmlFor='password'>
                  {t('authentication:password-label')}
                </label>
                <input
                  className='input-default'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  ref={register({ required: true })}
                />
                {errors.password && <FormError type={errors.identifier.type} />}
              </div>

              <div className='form-element'>
                <div className='flex flex-row flex-space-between'>
                  Show password
                  <input
                    type='checkbox'
                    name='showPassword'
                    onChange={() => toggleShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <Button type='submit' className='btn btn-default'>
                {t('authentication:login-label')}
              </Button>
              {error && <span className='form-error'>{error}</span>}
            </form>
            <div className='flex flex-row flex-space-between'>
              <Link className='link link-default' to='/forgotPassword'>
                {t('authentication:forgot-password')}
              </Link>
              <Link className='link link-default' to='/register'>
                {t('authentication:create-account')}
              </Link>
            </div>
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

export default Login

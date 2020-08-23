import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Link, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth'

import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import LanguageDropdown from '../components/LanguageDropdown'
import FormError from '../components/FormError'
import Context from '../modules/Context'

export const Login = (props) => {
  const { message } = props

  const { t, i18n } = useTranslation()

  const { login } = useAuth()

  const { register, handleSubmit, errors } = useForm()

  const [showPassword, toggleShowPassword] = useState(false)

  const { state, dispatch } = useContext(Context)

  const onSubmit = async (data) => {
    try {
      const payload = await login({
        identifier: data.identifier,
        password: data.password
      })
      localStorage.setItem('id', payload.user.id)
      localStorage.setItem('username', payload.user.username)
      localStorage.setItem('email', payload.user.email)
      dispatch({
        type: 'AUTHENTICATE'
      })
      navigate('/')
    } catch (e) {}
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
            <LanguageDropdown translator={i18n} />
          </div>
          <div>
            {message && <FormError message={message} />}
            {state.errorCode && <FormError status={state.errorCode} />}
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
                {errors.password && <FormError type={errors.password.type} />}
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

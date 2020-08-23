import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Link, navigate } from '@reach/router'
import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'

import FormError from '../components/FormError'
import LanguageDropdown from '../components/LanguageDropdown'
import { useTranslation } from 'react-i18next'

export const Register = () => {
  const { registerUser } = useAuth()

  const { state, dispatch } = useContext(Context)

  const { register, handleSubmit, errors, watch } = useForm()

  const { t, i18n } = useTranslation()

  const onSubmit = async (data) => {
    try {
      const payload = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password
      })
      localStorage.setItem('status', payload.status)
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
            {state.errorCode && <FormError status={state.errorCode} />}
            <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
              <div className='header'>{t('authentication:title-sign-up')}</div>
              <div className='form-element'>
                <label htmlFor='username'>
                  {t('authentication:username-label')}
                </label>
                <input
                  className='input-default'
                  type='text'
                  name='username'
                  ref={register({ required: true })}
                />
                {errors.username && <FormError type={errors.username.type} />}
              </div>

              <div className='form-element'>
                <label htmlFor='email'>{t('authentication:email-label')}</label>
                <input
                  className='input-default'
                  type='text'
                  name='email'
                  ref={register({ required: true })}
                />
                {errors.email && <FormError type={errors.email.type} />}
              </div>

              <div className='form-element'>
                <label htmlFor='password'>
                  {t('authentication:password-label')}
                </label>
                <input
                  className='input-default'
                  type='password'
                  name='password'
                  ref={register({
                    required: true,
                    validate: (value) => value === watch('confirmPassword')
                  })}
                />
                {errors.password && <FormError type={errors.password.type} />}
              </div>

              <div className='form-element'>
                <label htmlFor='password'>
                  {t('authentication:confirm-password-label')}
                </label>
                <input
                  className='input-default'
                  type='password'
                  name='confirmPassword'
                  ref={register({ required: true })}
                />
                {errors.confirmPassword && (
                  <FormError type={errors.confirmPassword.type} />
                )}
              </div>

              <div className='form-element'>
                <div className='flex flex-row flex-space-between'>
                  <label htmlFor='tc'>
                    I agree to the{' '}
                    <Link className='link link-default' to='/policies'>
                      Terms and Conditions
                    </Link>
                  </label>
                  <input type='checkbox' name='tc' ref={register} />
                </div>
              </div>

              <Button type='submit' className='btn btn-default'>
                {t('authentication:register-label')}
              </Button>
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

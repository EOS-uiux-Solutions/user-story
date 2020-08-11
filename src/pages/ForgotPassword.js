import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Link } from '@reach/router'
import { useTranslation } from 'react-i18next'

import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import FormError from '../components/FormError'
import useAuth from '../hooks/useAuth'

const ForgotPassword = () => {
  const { t, i18n } = useTranslation()

  const { forgotPassword } = useAuth()

  const { register, handleSubmit, errors } = useForm()

  const [error, setError] = useState('')

  const [response, setResponse] = useState('')

  const onSubmit = async (data) => {
    try {
      const reply = await forgotPassword({
        email: data.email
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
            <div className='header'>{t('authentication:forgot-password')}</div>
            {response ? (
              <>
                <p>We have e-mailed you a password reset link</p>
              </>
            ) : (
              <>
                <form
                  className='form-default'
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className='form-element'>
                    <label htmlFor='email'>
                      {t('authentication:email-label')}
                    </label>
                    <input
                      className='input-default'
                      type='email'
                      name='email'
                      ref={register({ required: true })}
                    />
                    {errors.email && <FormError type={errors.email.type} />}
                  </div>
                  <Button type='submit' className='btn btn-default'>
                    {t('authentication:submit-label')}
                  </Button>
                  {error && <span className='form-error'>{error}</span>}
                </form>
                <div className='flex flex-row flex-space-between'>
                  <Link className='link link-default' to='/login'>
                    {t('authentication:existing-user')}
                  </Link>
                </div>
              </>
            )}
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

export default ForgotPassword

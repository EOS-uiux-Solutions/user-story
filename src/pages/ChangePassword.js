import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'

import { navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import Button from '../components/Button'
import useAuth from '../hooks/useAuth'
import FormError from '../components/FormError'
import Context from '../modules/Context'
import AuthWrapper, {
  AuthLeftContainer,
  AuthRightContainer
} from '../components/AuthWrapper'

import Login from './Login'

const ChangePassword = () => {
  const { t } = useTranslation()

  const { state, dispatch } = useContext(Context)

  const { changePassword, logout } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [response, setResponse] = useState('')

  const onSubmit = async (data) => {
    try {
      const reply = await changePassword({
        ...data,
        id: localStorage.getItem('id')
      })
      setResponse(reply)
    } catch (e) {}
  }

  const handleNavigateToLogin = async () => {
    await logout()
    dispatch({
      type: 'DEAUTHENTICATE'
    })
    navigate('/login')
  }

  return state.auth ? (
    <>
      <Helmet>
        <title>Change your password | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <AuthWrapper>
        <AuthLeftContainer />
        <AuthRightContainer>
          <div>
            {response ? (
              <>
                <div className='header'>{t('authentication:success')}</div>
                <p>Your password has been reset.</p>
                <div className='flex flex-row flex-space-between'>
                  <span
                    className='link link-default'
                    onClick={handleNavigateToLogin}
                  >
                    {t('authentication:reset-password-done')}
                  </span>
                </div>
              </>
            ) : (
              <>
                {state.errorCode && <FormError status={state.errorCode} />}
                <form
                  className='form-default'
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className='header'>
                    {t('authentication:reset-password')}
                  </div>
                  <div className='form-element'>
                    <label htmlFor='password'>
                      {t('authentication:old-password')}
                    </label>
                    <input
                      className='input-default'
                      type='password'
                      {...register('oldPassword', { required: true })}
                    />
                    {errors.oldPassword && (
                      <FormError type={errors.oldPassword.type} />
                    )}
                  </div>
                  <div className='form-element'>
                    <label htmlFor='password'>
                      {t('authentication:new-password')}
                    </label>
                    <input
                      className='input-default'
                      type='password'
                      {...register('password', { required: true })}
                    />
                    {errors.password && (
                      <FormError type={errors.password.type} />
                    )}
                  </div>
                  <div className='form-element'>
                    <label htmlFor='confirm-password'>
                      {t('authentication:confirm-password')}
                    </label>
                    <input
                      className='input-default'
                      type='password'
                      {...register('passwordConfirmation', { required: true })}
                    />
                    {errors.passwordConfirmation && (
                      <FormError type={errors.passwordConfirmation.type} />
                    )}
                  </div>
                  <Button type='submit' className='btn btn-default'>
                    {t('authentication:submit-label')}
                  </Button>
                </form>
              </>
            )}
          </div>
        </AuthRightContainer>
      </AuthWrapper>
    </>
  ) : (
    <Login message='Please login to access your profile' />
  )
}

export default ChangePassword

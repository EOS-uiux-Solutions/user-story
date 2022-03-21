import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { EOS_VISIBILITY, EOS_VISIBILITY_OFF } from 'eos-icons-react'

import { Link, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth'
import { Helmet } from 'react-helmet'
import toast from 'react-hot-toast'

import Button from '../components/Button'
import FormError from '../components/FormError'
import Context from '../modules/Context'
import AuthWrapper, {
  AuthLeftContainer,
  AuthRightContainer
} from '../components/AuthWrapper'

export const Login = (props) => {
  const { message } = props

  const { t } = useTranslation()

  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

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
      toast.success(`Logged in successfully as ${payload.user.username}`)
      navigate('/', { replace: true })
    } catch (e) {}
  }

  if (state.auth) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <>
      <Helmet>
        <title>Login | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <AuthWrapper>
        <AuthLeftContainer />
        <AuthRightContainer>
          <div>
            <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
              <div className='header'>{t('authentication:title-sign-in')}</div>
              {message && <FormError message={message} />}
              {state.errorCode && <FormError status={state.errorCode} />}
              <div className='form-element'>
                <label htmlFor='identifer'>
                  {t('authentication:username-label')}
                </label>
                <input
                  className='input-default'
                  type='text'
                  data-cy='login-username'
                  {...register('identifier', { required: true })}
                />
                {errors?.identifier && (
                  <FormError type={errors?.identifier.type} />
                )}
              </div>

              <div className='form-element'>
                <label htmlFor='password'>
                  {t('authentication:password-label')}
                </label>
                <div className='input-group'>
                  <input
                    className='input-default'
                    type={showPassword ? 'text' : 'password'}
                    data-cy='login-password'
                    {...register('password', { required: true })}
                  ></input>

                  <div
                    className='input-group-append'
                    onClick={() => toggleShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EOS_VISIBILITY_OFF className='eos-icons eos-18' />
                    ) : (
                      <EOS_VISIBILITY className='eos-icons eos-18' />
                    )}
                  </div>
                </div>
                {errors?.password && <FormError type={errors?.password.type} />}
              </div>

              <Button
                type='submit'
                className='btn btn-default'
                data-cy='login-btn'
              >
                {t('authentication:login-label')}
              </Button>
            </form>
            <div className='flex flex-row flex-space-between margin-top-l'>
              <Link className='link link-default' to='/forgotPassword'>
                {t('authentication:forgot-password')}
              </Link>
              <Link
                className='link link-default'
                data-cy='link-create-account'
                to='/register'
              >
                {t('authentication:create-account')}
              </Link>
            </div>
          </div>
        </AuthRightContainer>
      </AuthWrapper>
    </>
  )
}

export default Login

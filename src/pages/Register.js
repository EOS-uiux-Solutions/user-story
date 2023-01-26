import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet'
import toast from 'react-hot-toast'
import { globalHistory, Link, navigate } from '@reach/router'
import Button from '../components/Button'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'

import FormError from '../components/FormError'
import { useTranslation } from 'react-i18next'
import AuthWrapper, {
  AuthLeftContainer,
  AuthRightContainer
} from '../components/AuthWrapper'

export const Register = () => {
  const { registerUser } = useAuth()

  const { state, dispatch } = useContext(Context)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { t } = useTranslation()

  useEffect(() => {
    globalHistory.listen(({ location }) => {
      if (location.pathname === '/login') {
        dispatch({ type: 'ERROR', payload: null })
      }
    })
  })

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
      toast.success(`Successfully registered as ${payload.user.username}`)
      navigate('/', { replace: true })
    } catch (e) {
      console.error(e.message)
    }
  }

  if (state.auth) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <>
      <Helmet>
        <title>Registration page | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <AuthWrapper>
        <AuthLeftContainer />
        <AuthRightContainer>
          <div>
            <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
              <div className='header'>{t('authentication:title-sign-up')}</div>
              {state.errorCode && <FormError status={state.errorCode} />}
              <div className='form-element'>
                <label htmlFor='username'>
                  {t('authentication:username-label')}
                </label>
                <input
                  className='input-default'
                  type='text'
                  data-cy='username'
                  {...register('username', { required: true })}
                />
                {errors.username && <FormError type={errors.username.type} />}
              </div>
              <div className='form-element'>
                <label htmlFor='email'>{t('authentication:email-label')}</label>
                <input
                  className='input-default'
                  type='text'
                  data-cy='email'
                  {...register('email', { required: true })}
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
                  data-cy='password'
                  {...register('password', {
                    required: 'This is required',
                    minLength: {
                      value: 8,
                      message: 'Password must have at least 8 characters'
                    }
                  })}
                />
                {errors.password && (
                  <FormError message={errors.password.message} />
                )}
              </div>
              <div className='form-element'>
                <div className='flex flex-row flex-align-center '>
                  <input
                    type='checkbox'
                    data-cy='tc'
                    {...register('tc', {
                      required: 'You must accept our Terms and Conditions'
                    })}
                  />
                  <label htmlFor='tc'>
                    I agree to the{' '}
                    <Link className='link link-default' to='/policies'>
                      Terms and Conditions
                    </Link>
                    {errors.tc && <FormError message={errors.tc.message} />}
                  </label>
                </div>
              </div>
              <Button
                type='submit'
                className='btn btn-default'
                data-cy='btn-register'
              >
                {t('authentication:register-label')}
              </Button>
            </form>
            <div className='flex flex-row flex-space-between margin-top-l'>
              <Link className='link link-default' to='/login'>
                {t('authentication:existing-user')}
              </Link>
            </div>
          </div>
        </AuthRightContainer>
      </AuthWrapper>
    </>
  )
}

export default Register

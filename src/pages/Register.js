import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Link, navigate } from '@reach/router'
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

  const { register, handleSubmit, errors } = useForm()

  const { t } = useTranslation()

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
    <AuthWrapper>
      <AuthLeftContainer />
      <AuthRightContainer>
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
            7lPYrwEiDLy3uN(g&(*UhYYi
            <div className='form-element'>
              <div className='flex flex-row flex-align-center '>
                <input
                  type='checkbox'
                  name='tc'
                  ref={register({
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
            <Button type='submit' className='btn btn-default'>
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
  )
}

export default Register

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

  const { register, handleSubmit, errors, watch } = useForm()

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
      </AuthRightContainer>
    </AuthWrapper>
  )
}

export default Register

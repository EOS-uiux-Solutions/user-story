import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Link, useLocation } from '@reach/router'
import { useTranslation } from 'react-i18next'

import Button from '../components/Button'
import useAuth from '../hooks/useAuth'
import FormError from '../components/FormError'
import Context from '../modules/Context'
import AuthWrapper, {
  AuthLeftContainer,
  AuthRightContainer
} from '../components/AuthWrapper'

const ChangePassword = () => {
  const { t } = useTranslation()

  const { state } = useContext(Context)

  const { resetPassword } = useAuth()

  const { register, handleSubmit, errors } = useForm()

  const location = useLocation()

  const [response, setResponse] = useState('')

  const onSubmit = async (data) => {
    try {
      const reply = await resetPassword({
        code: location.search.slice(6),
        password: data.password,
        passwordConfirmation: data.passwordConfirmation
      })
      setResponse(reply)
    } catch (e) {}
  }

  return (
    <AuthWrapper>
      <AuthLeftContainer />
      <AuthRightContainer>
        <div>
          {response ? (
            <>
              <div className='header'>
                {t('authentication:forgot-password')}
              </div>
              <p>Your password has been reset.</p>
              <div className='flex flex-row flex-space-between'>
                <Link className='link link-default' to='/login'>
                  {t('authentication:reset-password-done')}
                </Link>
              </div>
            </>
          ) : (
            <>
              {state.errorCode && <FormError status={state.errorCode} />}
              <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
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
                    name='oldPassword'
                    ref={register({ required: true })}
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
                    name='password'
                    ref={register({ required: true })}
                  />
                  {errors.password && <FormError type={errors.password.type} />}
                </div>
                <div className='form-element'>
                  <label htmlFor='confirm-password'>
                    {t('authentication:confirm-password')}
                  </label>
                  <input
                    className='input-default'
                    type='password'
                    name='passwordConfirmation'
                    ref={register({ required: true })}
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
  )
}

export default ChangePassword

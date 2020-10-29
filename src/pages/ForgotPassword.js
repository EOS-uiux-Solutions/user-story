import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Link } from '@reach/router'
import { useTranslation } from 'react-i18next'

import Button from '../components/Button'
import FormError from '../components/FormError'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'
import AuthWrapper, {
  AuthLeftContainer,
  AuthRightContainer
} from '../components/AuthWrapper'

const ForgotPassword = () => {
  const { t } = useTranslation()

  const { state } = useContext(Context)

  const { forgotPassword } = useAuth()

  const { register, handleSubmit, errors } = useForm()

  const [response, setResponse] = useState('')

  const onSubmit = async (data) => {
    try {
      const reply = await forgotPassword({
        email: data.email
      })
      setResponse(reply)
    } catch (e) {}
  }

  return (
    <AuthWrapper>
      <AuthLeftContainer />
      <AuthRightContainer>
        <div>
          <div className='header'>{t('authentication:forgot-password')}</div>
          {response ? (
            <>
              <p>We have e-mailed you a password reset link</p>
            </>
          ) : (
            <>
              {state.errorCode && <FormError status={state.errorCode} />}
              <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
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
              </form>
              <div className='flex flex-row flex-space-between'>
                <Link className='link link-default' to='/login'>
                  {t('authentication:existing-user')}
                </Link>
              </div>
            </>
          )}
        </div>
      </AuthRightContainer>
    </AuthWrapper>
  )
}

export default ForgotPassword

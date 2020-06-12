import React from 'react'
import { Link } from '@reach/router'
import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import { useTranslation } from 'react-i18next'

export const Login = () => {
  // const { dispatch } = React.useContext(AuthContext)
  const { t, i18n } = useTranslation()
  const initialState = {
    username: '',
    email: '',
    password: '',
    isSubmitting: false,
    errorMessage: null
  }
  const [data, setData] = React.useState(initialState)
  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }
  const handleFormSubmit = (event) => {}
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
              <div className='header'>
                {t('authentication:header-left')}
              </div>
              <p>{t('authentication:feature-request-description')}</p>
            </div>
          </div>
          <div className='footer'>
            {t('authentication:footer-left')}
            {/* <a href='#'>Learn More</a> */}
          </div>
        </div>
        <div className='container-right'>
          <div className='flex-row'>
            <div className='image image-logo eos-logo-resize'>
              <img src={eosLogoColoured} alt='EOS Logo' />
            </div>
            <Dropdown translator={i18n} />
          </div>
          <div>
            <form className='form' onSubmit={handleFormSubmit}>
              <div className='header'>
                {t('authentication:title-sign-in')}
              </div>
              <div className='form-group'>
                <label htmlFor='email'>
                  {t('authentication:username-label')}
                </label>
                <input type='text' name='email' onChange={handleInputChange} />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>
                  {t('authentication:password-label')}
                </label>
                <input
                  type='password'
                  name='password'
                  onChange={handleInputChange}
                />
              </div>
              <Button
                type='submit'
                className='btn btn-default'
                disabled={data.isSubmitting}
              >
                {t('authentication:login-label')}
              </Button>
            </form>
            <div className='flex-row'>
              <Link to='/forgotPassword'>
                {t('authentication:forgot-password')}
              </Link>
              <Link to='/signUp'>{t('authentication:create-account')}</Link>
            </div>
          </div>
          <div className='footer'>
            <span> {t('authentication:footer-right')} </span>
          </div>
          {data.errorMessage && (
            <span className='form-error'>{data.errorMessage}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

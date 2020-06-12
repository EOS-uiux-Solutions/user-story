import React from 'react'
// import axios from 'axios'
import { Link } from 'react-router-dom'
import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import { useTranslation } from 'react-i18next'

export const ForgotPassword = () => {
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
              <div className='header'>{t('authentication:header-left')}</div>
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
            <Dropdown translator={i18n}/>
          </div>
          <div>
            <form className='form' onSubmit={handleFormSubmit}>
              <div className='header'>{t('authentication:forgot-password')}</div>
              <div className='form-group'>
                <label htmlFor='email'>{t('authentication:email-label')}</label>
                <input type='text' name='email' onChange={handleInputChange} />
              </div>
              <Button
                type='submit'
                className='btn btn-default'
                disabled={data.isSubmitting}
              >
                {t('authentication:submit-label')}
              </Button>
            </form>
            <Link className='link link-redirect' to='/'>
              {t('authentication:existing-user')}
            </Link>
          </div>
          <div className='footer'>
          <span>{t('authentication:footer-right')} </span>
          </div>
          {data.errorMessage && (
            <span className='form-error'>{data.errorMessage}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

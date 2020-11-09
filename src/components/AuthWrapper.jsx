import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from './LanguageDropdown'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import SocialMediaLinks from '../components/SocialMediaLinks'
export const AuthWrapper = ({ children }) => {
  return (
    <div className='authentication-wrapper'>
      <div className='authentication'>{children}</div>
    </div>
  )
}

export const AuthLeftContainer = () => {
  const { t } = useTranslation()

  return (
    <div className='container-left'>
      <div className='container-left-content'>
        <div className='header header-uppercase'>
          {t('authentication:header-left')}
        </div>
        <p>{t('authentication:user-stories-description')}</p>
        <div className='footer'>
          <p>
            {t('authentication:footer-left')} -{' '}
            <a className='link link-default' href='/policies'>
              Learn More
            </a>
          </p>
        </div>
        <SocialMediaLinks />
      </div>
    </div>
  )
}

export const AuthRightContainer = ({ children, logo }) => {
  const { t, i18n } = useTranslation()

  return (
    <div className='container-right'>
      <div className='flex flex-row flex-space-between'>
        <div className='image image-logo eos-logo-resize'>
          <img src={logo ?? eosLogoColoured} alt='EOS Logo' />
        </div>
        <LanguageDropdown translator={i18n} />
      </div>
      {children}
      <div className='footer'>
        <span>
          <i className='eos-icons'>copyright</i>
          <span> {t('authentication:footer-right')} </span>
        </span>
        <a className='link link-default' href='/policies'>
          {' '}
          Cookies and Privacy policy
        </a>
      </div>

      <div className='cookies-mobile'>
        <p>
          {t('authentication:footer-left')} -{' '}
          <a className='link link-default' href='/policies'>
            Learn More
          </a>
        </p>
      </div>
    </div>
  )
}

export default AuthWrapper

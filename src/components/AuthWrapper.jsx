import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from './LanguageDropdown'
import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'

export const AuthWrapper = ({ children }) => {
  return (
    <div className='authentication-wrapper'>
      <div className='authentication'>{children}</div>
    </div>
  )
}

export const AuthLeftContainer = ({ logo, illustration }) => {
  const { t } = useTranslation()

  return (
    <div className='container-left'>
      <div>
        <div className='image image-logo'>
          <img src={logo ?? eosLogoWhite} alt='EOS Logo' />
        </div>
        <div className='image image-center'>
          <img
            src={illustration ?? eosLock}
            alt='Illustration of a lock with dots floating around'
          />
        </div>
        <div>
          <div className='header'>{t('authentication:header-left')}</div>
          <p>{t('authentication:user-stories-description')}</p>
        </div>
      </div>
      <div className='footer'>{t('authentication:footer-left')}</div>
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
        <i className='eos-icons'>copyright</i>
        <span> {t('authentication:footer-right')} </span>
      </div>
    </div>
  )
}

export default AuthWrapper

import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from './LanguageDropdown'
import eosLogoColoured from '../assets/images/logo-coloured.png'

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
            <a className='link link-default' href='/todo'>
              Learn More
            </a>
          </p>
        </div>
        <div className='social-media'>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://twitter.com/eosdesignsystem?lang=en'
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
              <g data-name='Group 60'>
                <g data-name='Group 62'>
                  <g data-name='Rectangle 278'>
                    <path data-name='Rectangle 1959' d='M0 0h24v24H0z' />
                  </g>
                  <g data-name='Path 18'>
                    <path
                      data-name='Path 628'
                      d='M20.032 6.899a7.368 7.368 0 01-1.887.521 3.1 3.1 0 001.431-1.822 6.77 6.77 0 01-2.082.813A3.291 3.291 0 0011.8 8.656a2.742 2.742 0 00.1.748 9.284 9.284 0 01-6.8-3.448 3.584 3.584 0 00-.423 1.659 3.286 3.286 0 001.464 2.733 3.319 3.319 0 01-1.5-.423v.033a3.283 3.283 0 002.639 3.221 3.008 3.008 0 01-1.5.065 3.3 3.3 0 003.059 2.278 6.642 6.642 0 01-4.1 1.4 6.364 6.364 0 01-.781-.033 9.184 9.184 0 005.076 1.5 9.306 9.306 0 009.371-9.24v-.558a6.727 6.727 0 001.627-1.692z'
                      fill='#fff'
                    />
                  </g>
                </g>
              </g>
            </svg>
          </a>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.linkedin.com/company/eosdesignsystem/'
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
              <g data-name='Group 61'>
                <g data-name='Group 63'>
                  <g data-name='Rectangle 280'>
                    <path data-name='Rectangle 1961' d='M0 0h24v24H0z' />
                  </g>
                  <g data-name='iconfinder 201-LinkedIn 192159'>
                    <g data-name='Path 19'>
                      <path
                        data-name='Path 630'
                        d='M16.802 19.604v-6.058a1.8 1.8 0 00-1.747-1.621 1.9 1.9 0 00-1.854 1.541v6.138h-3.23l.053-10.007h3.124l-.025 1.262a3.139 3.139 0 013.106-1.644c2.453 0 3.565 1.41 3.772 4.047v6.347zM6.011 8.175a1.788 1.788 0 11.438 0 1.789 1.789 0 01-.438 0zm1.993 11.441H4.032V9.622l3.97-.025z'
                        fill='#fff'
                      />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </div>
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
        <a className='link link-default' href='#todo'>
          {' '}
          Terms and conditions
        </a>
      </div>
    </div>
  )
}

export default AuthWrapper

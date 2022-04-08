import React from 'react'
import { apiURL } from '../config.json'

import GoogleLogo from '../assets/images/google-logo.png'

const ProviderButton = ({ provider, logo }) => {
  return (
    <a href={`${apiURL}/connect/${provider}`}>
      <img src={logo} alt='Sign In with Google' width={50} height={50} />
    </a>
  )
}

const ProviderLogin = () => {
  return (
    <div className='provider-login'>
      <p>
        or, <strong>Login with</strong>
      </p>
      <ProviderButton provider={'google'} logo={GoogleLogo} />
    </div>
  )
}

export default ProviderLogin

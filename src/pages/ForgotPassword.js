import React from 'react'
// import axios from 'axios'
import { Link } from 'react-router-dom'
import eosLogoWhite from '../assets/images/logo-white.png'
import eosLogoColoured from '../assets/images/logo-coloured.png'
import eosLock from '../assets/images/authentication-lock.png'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'

export const ForgotPassword = () => {
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
              <div className='header'>Feature Request</div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </p>
            </div>
          </div>
          <div className='footer'>
            This site saves some information in cookies but only when strictly
            necessary
            {/* <a href='#'>Learn More</a> */}
          </div>
        </div>
        <div className='container-right'>
          <div className='flex-row'>
            <div className='image image-logo eos-logo-resize'>
              <img src={eosLogoColoured} alt='EOS Logo' />
            </div>
            <Dropdown />
          </div>
          <div>
            <form className='form' onSubmit={handleFormSubmit}>
              <div className='header'>Forgot Password</div>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input type='text' name='email' onChange={handleInputChange} />
              </div>
              <Button
                type='submit'
                className='btn btn-default'
                disabled={data.isSubmitting}
              >
                {data.isSubmitting ? 'Loading...' : 'Submit'}
              </Button>
            </form>
            <Link className='link link-redirect' to='/'>
              Existing User?
            </Link>
          </div>
          <div className='footer'>
            <span> Copyright 2020 EOS </span>
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

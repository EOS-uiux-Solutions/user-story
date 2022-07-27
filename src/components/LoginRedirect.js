import React, { useEffect, useState, useContext } from 'react'
import { navigate, useLocation, useParams } from '@reach/router'
import Context from '../modules/Context'
const { apiURL } = require('../config.json')

const LoginRedirect = (props) => {
  const [text, setText] = useState('Loading...')
  const location = useLocation()
  const params = useParams()
  const { dispatch } = useContext(Context)

  useEffect(() => {
    // Successfully logged with the provider
    // Now logging with strapi by using the access_token (given by the provider) in props.location.search
    fetch(`${apiURL}/auth/okta/callback${location.search}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi. Status: ${res.status}`)
        }
        return res
      })
      .then((res) => res.json())
      .then((res) => {
        // Successfully logged with Strapi
        // Now saving the jwt to use it for future authenticated requests to Strapi
        localStorage.setItem('jwt', res.jwt)
        localStorage.setItem('username', res.user.username)
        localStorage.setItem('email', res.user.email)
        localStorage.setItem('id', res.user.id)
        setText(
          'You have been successfully logged in. You will be redirected in a few seconds...'
        )
        dispatch({
          type: 'AUTHENTICATE'
        })
        setTimeout(() => navigate('/'), 3000) // Redirect to homepage after 3 sec
      })
      .catch((err) => {
        console.log(err)
        setText('An error occurred, please see the developer console.')
      })
  }, [dispatch, location.search, params.providerName])

  return <p>{text}</p>
}

export default LoginRedirect

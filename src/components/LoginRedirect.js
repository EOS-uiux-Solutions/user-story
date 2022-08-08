import React, { useEffect, useContext } from 'react'
import { useLocation, useParams, navigate } from '@reach/router'
import Context from '../modules/Context'
import LoadingIndicator from '../modules/LoadingIndicator'
import axios from 'axios'
import toast from 'react-hot-toast'
const { apiURL } = require('../config.json')

const LoginRedirect = () => {
  const location = useLocation()
  const params = useParams()
  const { dispatch } = useContext(Context)

  useEffect(() => {
    // Successfully logged with the provider
    // Now logging with strapi by using the access_token (given by the provider) in props.location.search
    axios
      .get(`${apiURL}/auth/okta/callback${location.search}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi. Status: ${res.status}`)
        }
        return res
      })
      .then((res) => {
        // Successfully logged with Strapi
        // Now saving the jwt to use it for future authenticated requests to Strapi
        localStorage.setItem('jwt', res.data.jwt)
        localStorage.setItem('username', res.data.user.username)
        localStorage.setItem('email', res.data.user.email)
        localStorage.setItem('id', res.data.user.id)
        dispatch({
          type: 'AUTHENTICATE'
        })
        setTimeout(() => navigate('/'), 3000) // Redirect to homepage after 3 sec
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.message)
        setTimeout(() => navigate('/'), 3000)
      })
  }, [dispatch, location.search, params.providerName])

  return <LoadingIndicator />
}

export default LoginRedirect

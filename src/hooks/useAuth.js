import axios from 'axios'
import Context from '../modules/Context'
import { useContext } from 'react'
import { useOktaAuth } from '@okta/okta-react'
const { apiURL, SSO } = require('../config.json')

const useAuth = () => {
  const { dispatch } = useContext(Context)

  const { authState, oktaAuth } = useOktaAuth === null ? null : useOktaAuth

  const registerUser = async (credentials) => {
    const { data: payload } = await axios
      .post(`${apiURL}/auth/local/register`, credentials, {
        withCredentials: true
      })
      .catch((err) => {
        if (err.message === 'Network Error')
          dispatch({
            type: 'ERROR',
            payload: err.message
          })
        else
          dispatch({
            type: 'ERROR',
            payload: err.response.data.message[0].messages[0].message
          })
      })
    return payload
  }

  const login = async (credentials) => {
    if (SSO) {
      await oktaAuth.signInWithRedirect()
      if (!authState || !authState.isAuthenticated) {
        dispatch({
          type: 'DEAUTHENTICATE'
        })
      } else {
        dispatch({
          type: 'AUTHENTICATE'
        })
      }
    } else {
      const { data: payload } = await axios
        .post(`${apiURL}/auth/local`, credentials, { withCredentials: true })
        .catch((err) => {
          if (err.message === 'Network Error')
            dispatch({
              type: 'ERROR',
              payload: err.message
            })
          else
            dispatch({
              type: 'ERROR',
              payload: err.response.data.message[0].messages[0].message
            })
        })
      return payload
    }
  }

  const logout = async () => {
    if (SSO) {
      await oktaAuth.signOut()
      if (!authState || !authState.isAuthenticated) {
        dispatch({
          type: 'DEAUTHENTICATE'
        })
      }
    } else {
      await axios
        .post(`${apiURL}/logout`, {}, { withCredentials: true })
        .catch((err) => {
          if (err.message === 'Network Error')
            dispatch({
              type: 'ERROR',
              payload: err.message
            })
          else
            dispatch({
              type: 'ERROR',
              payload: err.response.data.message[0].messages[0].message
            })
        })
    }
    localStorage.clear()
  }

  const forgotPassword = async (credentials) => {
    const reply = await axios
      .post(`${apiURL}/auth/forgot-password`, credentials)
      .catch((err) => {
        if (err.message === 'Network Error')
          dispatch({
            type: 'ERROR',
            payload: err.message
          })
        else
          dispatch({
            type: 'ERROR',
            payload: err.response.data.message[0].messages[0].message
          })
      })
    return reply
  }

  const resetPassword = async (credentials) => {
    const reply = await axios
      .post(`${apiURL}/auth/reset-password`, credentials)
      .catch((err) => {
        if (err.message === 'Network Error')
          dispatch({
            type: 'ERROR',
            payload: err.message
          })
        else
          dispatch({
            type: 'ERROR',
            payload: err.response.data.message[0].messages[0].message
          })
      })
    return reply
  }

  const changePassword = async (credentials) => {
    if (credentials.password !== credentials.passwordConfirmation) {
      dispatch({
        type: 'ERROR',
        payload: 'The new password and confirm passwords do not match.'
      })
      return null
    }
    const data = await axios
      .post(`${apiURL}/auth/change-password`, credentials, {
        withCredentials: true
      })
      .catch((err) => {
        if (err.message === 'Network Error')
          dispatch({
            type: 'ERROR',
            payload: err.message
          })
        else
          dispatch({
            type: 'ERROR',
            payload: err.response.data?.message?.[0]?.messages?.[0]?.message
          })
      })
    return data
  }

  return {
    registerUser,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword
  }
}

export default useAuth

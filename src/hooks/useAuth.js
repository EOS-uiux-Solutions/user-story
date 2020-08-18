import axios from 'axios'
import { apiURL } from '../config.json'
import Context from '../modules/Context'
import { useContext } from 'react'

const useAuth = () => {
  const { dispatch } = useContext(Context)

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

  const logout = async () => {
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

  return {
    registerUser,
    login,
    logout,
    forgotPassword,
    resetPassword
  }
}

export default useAuth

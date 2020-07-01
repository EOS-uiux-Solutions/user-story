import axios from 'axios'
import { apiURL } from '../config.json'

const useAuth = () => {
  const register = async (credentials) => {
    const { data: payload } = await axios.post(
      `${apiURL}/auth/local/register`,
      credentials,
      { withCredentials: true }
    )
    return payload
  }

  const login = async (credentials) => {
    const { data: payload } = await axios.post(
      `${apiURL}/auth/local`,
      credentials,
      { withCredentials: true }
    )
    return payload
  }

  const logout = async () => {
    await axios.post(`${apiURL}/logout`, {}, { withCredentials: true })
    localStorage.clear()
  }

  const forgotPassword = async (credentials) => {
    const reply = await axios.post(
      `${apiURL}/auth/forgot-password`,
      credentials
    )
    return reply
  }

  const resetPassword = async (credentials) => {
    const reply = await axios.post(`${apiURL}/auth/reset-password`, credentials)
    return reply
  }

  return {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
  }
}

export default useAuth

import { useReducer } from 'react'
import axios from 'axios'

const apiURL = 'http://localhost:1337'

const DEFAULT_STATE = {
  user: {},
  status: 'public'
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user || {},
        status: action.payload.status || 'public'
      }
    case 'LOGOUT':
      return {
        ...state,
        user: {},
        status: 'public'
      }
    default:
      return DEFAULT_STATE
  }
}

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)

  const register = async (credentials) => {
    const { data: payload } = await axios.post(
      `${apiURL}/auth/local/register`,
      credentials
    )
    return dispatch({ type: 'LOGIN', payload })
  }

  const login = async (credentials) => {
    const { data: payload } = await axios.post(
      `${apiURL}/auth/local`,
      credentials
    )
    return dispatch({ type: 'LOGIN', payload })
  }

  const logout = () => {
    return dispatch({ type: 'LOGOUT' })
  }

  const forgotPassword = async (credentials) => {
    await axios.post(`${apiURL}/auth/forgot-password`, credentials)
  }

  return {
    state,
    register,
    login,
    logout,
    forgotPassword
  }
}

export default useAuth

import { useReducer } from 'react'
import axios from 'axios'

const apiURL = 'http://localhost:1337'

const DEFAULT_STATE = {
  jwt: null,
  user: {},
  loggedIn: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        jwt: action.payload.jwt || null,
        user: action.payload.user || {},
        loggedIn: true
      }
    case 'LOGOUT':
      return {
        ...state,
        jwt: null,
        user: {},
        loggedIn: false
      }
    default:
      return DEFAULT_STATE
  }
}

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)
  const isAuthenticated = Object.keys(state.user).length
    ? state.loggedIn
    : false

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
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword
  }
}

export default useAuth

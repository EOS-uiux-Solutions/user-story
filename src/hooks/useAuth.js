import { useReducer } from 'react'
import axios from 'axios'

const apiURL = 'http://localhost:1337'

const DEFAULT_STATE = {
  jwt: null,
  user: {},
  registered: false,
  loggedIn: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER':
      return {
        ...state,
        jwt: action.payload.jwt || null,
        user: action.payload.user || {},
        registered: true
      }
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
  const isRegistered = state.registered && Object.keys(state.user).length
  const isAuthenticated = state.loggedIn && Object.keys(state.user).length

  const register = async (credentials) => {
    try {
      const { data: payload } = await axios.post(
        `${apiURL}/auth/local/register`,
        credentials
      )
      return dispatch({ type: 'REGISTER', payload })
    } catch (e) {}
  }

  const login = async (credentials) => {
    try {
      const { data: payload } = await axios.post(
        `${apiURL}/auth/local`,
        credentials
      )
      return dispatch({ type: 'LOGIN', payload })
    } catch (e) {}
  }

  const logout = () => {
    return dispatch({ type: 'LOGOUT' })
  }

  return { state, isRegistered, isAuthenticated, register, login, logout }
}

export default useAuth

import React, { useEffect, useReducer } from 'react'
import { Router, navigate } from '@reach/router'
import './assets/scss/index.scss'
import { Toaster } from 'react-hot-toast'
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
import { LoginCallback, Security } from '@okta/okta-react'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NewStory from './pages/NewStory'
import Story from './pages/Story'
import MyStories from './pages/MyStories'
import MyProfile from './pages/MyProfile'
import Page404 from './pages/Page404'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Policies from './pages/Policies'
import Notifications from './pages/Notifications'
import Context from './modules/Context'
import ContextReducer from './modules/ContextReducer'
import Footer from './components/Footer'
const { SSO, issuer, clientId } = require('./config.json')

const initialState = {
  auth: false,
  errorCode: null
}

let oktaAuth

if (SSO) {
  oktaAuth = new OktaAuth({
    issuer: issuer,
    clientId: clientId,
    redirectUri: `${window.location.origin}/login/callback`
  })
}

const App = (props) => {
  const [state, dispatch] = useReducer(ContextReducer, initialState)

  const userId = localStorage.getItem('id')

  useEffect(() => {
    window.addEventListener('storage', (e) => {
      if (localStorage.getItem('id')) {
        dispatch({
          type: 'AUTHENTICATE'
        })
      } else {
        dispatch({
          type: 'DEAUTHENTICATE'
        })
      }
    })
  }, [])

  useEffect(() => {
    if (userId) {
      dispatch({
        type: 'AUTHENTICATE'
      })
    } else {
      dispatch({
        type: 'DEAUTHENTICATE'
      })
    }
  }, [userId])

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin))
  }

  const routes = (
    <Context.Provider value={{ state, dispatch }}>
      <Router>
        <Home path='/' />
        <Register path='/register' />
        <Login path='/login' />
        <ForgotPassword path='/forgotPassword' />
        <ResetPassword path='/resetPassword' />
        <NewStory path='/newStory' />
        <Story path='/story/:storyId' />
        <MyStories path='/myStories' />
        <MyProfile path='/myProfile' />
        <Profile path='/profile/:identifier' />
        <Notifications path='/notifications' />
        <ChangePassword path='/changePassword' />
        <Policies path='/policies' />
        <Page404 default />
        <LoginCallback path='/login/callback' />
      </Router>
      <Footer />
      <Toaster />
    </Context.Provider>
  )

  if (SSO) {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        {routes}
      </Security>
    )
  } else {
    return routes
  }
}

export default App

import React, { useEffect, useReducer } from 'react'
import { Router } from '@reach/router'

import '../node_modules/eos-icons/dist/css/eos-icons.css'
import './assets/scss/index.scss'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NewStory from './pages/NewStory'
import Story from './pages/Story'
import MyStories from './pages/MyStories'
import MyProfile from './pages/MyProfile'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Policies from './pages/Policies'
import Notifications from './pages/Notifications'
import Context from './modules/Context'
import ContextReducer from './modules/ContextReducer'
import Footer from './components/Footer'

const initialState = {
  auth: false,
  errorCode: null
}

const App = () => {
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

  return (
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
        <Profile path='/profile/:profileId' />
        <Notifications path='/notifications' />
        <ChangePassword path='/changePassword' />
        <Policies path='/policies' />
      </Router>
      <Footer />
    </Context.Provider>
  )
}

export default App

import React, { useState } from 'react'
import { Router } from '@reach/router'

import './assets/scss/index.scss'
import '../node_modules/eos-icons/dist/css/eos-icons.css'

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
import AuthContext from './modules/AuthContext'

const App = () => {
  const authHook = useState(false)

  return (
    <div className='app'>
      <AuthContext.Provider value={authHook}>
        <div className='app-container'>
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
        </div>
      </AuthContext.Provider>
    </div>
  )
}

export default App

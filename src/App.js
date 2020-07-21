import React from 'react'
import { Router } from '@reach/router'

import './assets/scss/index.scss'
import '../node_modules/eos-icons/dist/css/eos-icons.css'

import Navigation from './components/Navigation'
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

const App = () => {
  return (
    <div className='app'>
      <div className='app-container'>
        <Navigation />
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
        </Router>
      </div>
    </div>
  )
}

export default App

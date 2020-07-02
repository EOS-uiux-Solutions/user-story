import React from 'react'
import { Router } from '@reach/router'

import './assets/scss/index.scss'
import '../node_modules/eos-icons/dist/css/eos-icons.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NewStory from './pages/NewStory'

const App = () => {
  return (
    <div className='app'>
      <div className='app-container'>
        <Router>
          <Home path='/' />
          <Register path='/register' />
          <Login path='/login' />
          <ForgotPassword path='/forgotPassword' />
          <ResetPassword path='/resetPassword' />
          <NewStory path='/newStory' />
        </Router>
      </div>
    </div>
  )
}

export default App

import React from 'react'
import { Router } from '@reach/router'
import './assets/scss/index.scss'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

const App = () => {
  return (
    <div className='app'>
      <div className='app-container'>
        <Router>
          <Home path='/' />
          <Register path='/register' />
          <Login path='/login' />
          <ForgotPassword path='/forgotPassword' />
        </Router>
      </div>
    </div>
  )
}

export default App

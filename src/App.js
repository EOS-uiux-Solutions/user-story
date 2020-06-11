import React from 'react'
import { Router } from '@reach/router'
import './assets/scss/index.scss'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import AuthProvider from './utils/AuthContext'

const App = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App

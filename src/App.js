import React from 'react'
<<<<<<< HEAD
=======
import { Route } from 'react-router-dom'
import { authReducer } from './utils/Utilities'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import './assets/scss/index.scss'

export const AuthContext = React.createContext()
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
}
>>>>>>> 8e6a996... Added the WIP Authentication Module

function App() {
  const [state, dispatch] = React.useReducer(authReducer, initialState)
  return (
<<<<<<< HEAD
    <div className='App'>
      <header className='App-header'></header>
    </div>
=======
    <AuthContext.Provider value={{ state, dispatch }}>
      <div className='app'>
        <div className='app-container'>
          <Route
            exact
            path='/'
            component={state.isAuthenticated ? Home : Login}
          />
          <Route exact path='/forgotPassword' component={ForgotPassword} />
          <Route exact path='/signUp' component={Register} />
        </div>
      </div>
    </AuthContext.Provider>
>>>>>>> 8e6a996... Added the WIP Authentication Module
  )
}

export default App

import React, { useState, useContext, useEffect } from 'react'
import { useLocation, navigate } from '@reach/router'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import useAuth from '../hooks/useAuth'

import LoadingIndicator from '../modules/LoadingIndicator'
import Context from '../modules/Context'

const Auth = (props) => {
  const { provider } = props

  const location = useLocation()

  const { dispatch } = useContext(Context)

  const { promiseInProgress } = usePromiseTracker()

  const [error, setError] = useState(null)

  const { registerWithProvider } = useAuth()
  useEffect(() => {
    const register = async () => {
      try {
        const payload = await registerWithProvider(location.search, provider)
        localStorage.setItem('status', payload.status)
        localStorage.setItem('id', payload.user.id)
        localStorage.setItem('username', payload.user.username)
        localStorage.setItem('email', payload.user.email)
        dispatch({
          type: 'AUTHENTICATE'
        })
        navigate('/', { replace: true })
      } catch (err) {
        setError(err.message)
      }
    }
    trackPromise(register())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='authentication-page-wrapper'>
      {promiseInProgress && (
        <>
          <h2>Logging you in...</h2>
          <LoadingIndicator />
        </>
      )}
      {error && (
        <>
          <h1>An unexpected error occurred :(</h1>
          <h2>{error}</h2>
          <p>
            Please try to{' '}
            <a className='link link-default' href='/login'>
              Login
            </a>{' '}
            again. If the problem persists, please try contacting the site
            administrator.
          </p>
        </>
      )}
    </div>
  )
}

export default Auth

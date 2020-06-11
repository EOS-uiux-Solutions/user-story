import React, { useEffect, useContext } from 'react'
import { navigate } from '@reach/router'
import { AuthContext } from '../utils/AuthContext'

export const Home = () => {
  const { isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    if (!localStorage.getItem('ce4vtV3pgy#4uDvx')) {
      navigate('/register')
    }
  }, [isAuthenticated])

  return (
    <h3>
      {' '}
      This is a protected route which can only be accessed after user
      authentication.{' '}
    </h3>
  )
}

export default Home

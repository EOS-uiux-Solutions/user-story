import React, { useEffect, useState, useContext } from 'react'
import { Helmet } from 'react-helmet'
import toast from 'react-hot-toast'
import Navigation from '../components/Navigation'
import Context from '../modules/Context'
import Login from './Login'
import UserProfile from '../components/UserProfile'
import userStory from '../services/user_story'

const MyProfile = () => {
  const userId = localStorage.getItem('id')

  const { state } = useContext(Context)

  const [user, setUser] = useState('')

  const [, setUpdated] = useState(false)

  const [updatingField, setUpdatingField] = useState({})

  const [currFieldDefaultValue, setCurrFieldDefaultValue] = useState({})

  const assignCurrField = (val, name) => {
    setCurrFieldDefaultValue((p) => ({
      ...p,
      [name]: val
    }))
    setUpdatingField((p) => ({ ...p, [name]: val }))
  }

  const handleInputChange = (event) => {
    setUpdatingField((p) => ({ ...p, [event.target.name]: event.target.value }))
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const updateProfile = async (name) => {
    if (currFieldDefaultValue[name] === updatingField[name]) {
      toast.success('Nothing changed here')
      return
    }
    try {
      const response = await userStory.updateUser({ id: userId, ...user })
      if (response && updatingField[name].length === 0) {
        toast.success('Your data has been removed')
      } else if (response && updatingField[name].length > 0) {
        toast.success('Your changes have been saved')
      }
      setUpdated(true)
    } catch (err) {
      console.error(err.message)
      toast.error(err.message)
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await userStory.getUserDetails(userId)
      setUser(response.data.data.user)
    }
    if (userId) {
      fetchUserInfo()
    }
  }, [userId])

  return state.auth ? (
    <>
      <Helmet>
        <title>My profile | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper'>
          <div className='flex flex-row user-profile-wrapper'>
            <div className='flex flex-column'>
              <UserProfile
                user={user === '' ? '' : Object.assign(user, { id: userId })}
                handleInputChange={handleInputChange}
                updateProfile={updateProfile}
                assignCurrField={assignCurrField}
                allowEditing
              />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Login message='Please login to access your profile' />
  )
}

export default MyProfile

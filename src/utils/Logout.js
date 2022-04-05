import axios from 'axios'
import { navigate } from '@reach/router'
const { apiURL } = require('../config.json')

const logout = async () => {
  await axios.post(`${apiURL}/logout`, {}, { withCredentials: true })
  localStorage.clear()
  navigate('/')
}

export default logout

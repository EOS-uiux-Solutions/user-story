import axios from 'axios'
import { apiURL, APP_ENV } from '../config.json'

const config = {
  baseURL: apiURL,
  headers:{
    Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjM0MGEyYzk2NzVlNDYwY2IwNTY0OSIsImlhdCI6MTYzOTI1NTA1OSwiZXhwIjoxNjQxODQ3MDU5fQ.wvawV1CEVuot7v3RcZoMnJEoR78ru7r1kJ7fyRLjO7c"
  },
  withCredentials: true
}

const apiClient = axios.create(config)

apiClient.interceptors.response.use(
  (response) => {
    if (APP_ENV !== 'prod') {
      console.log('RESPONSE: ', response)
    }
    return response
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('RESPONSE_ERROR: ', error.response)
      return Promise.reject(error.response)
    } else if (error.request) {
      // The request was made but no response was received
      console.log('NO_RESPONSE: ', error.request)
    } else {
      // Something happened in setting up the request that triggered an error
      console.log('REQUEST_ERROR: ', error.message)
    }
  }
)

function apiCall(url, data, _method = 'post') {
  return apiClient.request({
    url,
    method: _method,
    data,
    ...config
  })
}

export default apiCall

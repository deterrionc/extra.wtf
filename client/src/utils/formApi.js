import axios from 'axios'
import store from '../store'
import { LOGOUT } from '../actions/types'

const formApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

formApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT })
    }
    return Promise.reject(err)
  }
)

export default formApi

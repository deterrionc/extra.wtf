import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'
import channel from './channel'

export default combineReducers({
  alert,
  auth,
  channel,
})

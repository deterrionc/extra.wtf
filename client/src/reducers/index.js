import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'
import channel from './channel'
import category from './category'

export default combineReducers({
  alert,
  auth,
  channel,
  category,
})

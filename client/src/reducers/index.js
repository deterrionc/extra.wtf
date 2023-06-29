import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'
import channel from './channel'
import category from './category'
import file from './file'
import spinner from './spinner'
import video from './video'

export default combineReducers({
  alert,
  auth,
  channel,
  category,
  file,
  spinner,
  video,
})

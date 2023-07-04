import { CHANNELS_LOADED, CHANNEL_LOADED, LAST_VIDEOS_LOADED } from "../actions/types";

const initialState = {
  channels: [],
  channel: {},
  lastVideos: [],
}

const channelReducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case CHANNELS_LOADED: {
      return {
        ...state,
        channels: payload
      }
    }
    case CHANNEL_LOADED: {
      return {
        ...state,
        channel: payload
      }
    }
    case LAST_VIDEOS_LOADED: {
      return {
        ...state,
        lastVideos: payload
      }
    }
    default: {
      return state
    }
  }
}

export default channelReducer
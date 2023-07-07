import { CHANNELS_LOADED, CHANNEL_LOADED, LOGS_LOADED } from "../actions/types";

const initialState = {
  channels: [],
  channel: {},
  logs: [],
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
    case LOGS_LOADED: {
      return {
        ...state,
        logs: payload
      }
    }
    default: {
      return state
    }
  }
}

export default channelReducer
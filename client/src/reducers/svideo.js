import { SVIDEOS_LOADED, SVIDEO_LOADED } from "../actions/types";

const initialState = {
  svideos: [],
  svideo: {}
}

const svideoReducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case SVIDEOS_LOADED: {
      return {
        ...state,
        svideos: payload
      }
    }
    case SVIDEO_LOADED: {
      return {
        ...state,
        svideo: payload
      }
    }
    default: {
      return state
    }
  }
}

export default svideoReducer
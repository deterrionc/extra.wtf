import { FILES_LOADED, FILE_LOADED } from "../actions/types";

const initialState = {
  files: [],
  file: {}
}

const fileReducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case FILES_LOADED: {
      return {
        ...state,
        files: payload
      }
    }
    case FILE_LOADED: {
      return {
        ...state,
        file: payload
      }
    }
    default: {
      return state
    }
  }
}

export default fileReducer
import { SPINNING } from "../actions/types";

const initialState = {
  isLoading: false
}

const spinnerReducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case SPINNING: {
      return {
        ...state,
        isLoading: payload
      }
    }
    default: {
      return state
    }
  }
}

export default spinnerReducer
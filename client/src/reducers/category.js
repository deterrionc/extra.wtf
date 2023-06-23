import { CATEGORIES_LOADED, CATEGORY_LOADED } from "../actions/types";

const initialState = {
  categories: [],
  category: {}
}

const categoryReducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case CATEGORIES_LOADED: {
      return {
        ...state,
        categories: payload
      }
    }
    case CATEGORY_LOADED: {
      return {
        ...state,
        category: payload
      }
    }
    default: {
      return state
    }
  }
}

export default categoryReducer
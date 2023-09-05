import { ARTICLES_LOADED, ARTICLE_LOADED } from "../actions/types";

const initialState = {
  articles: [],
  article: {}
}

const articleReducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case ARTICLES_LOADED: {
      return {
        ...state,
        articles: payload
      }
    }
    case ARTICLE_LOADED: {
      return {
        ...state,
        article: payload
      }
    }
    default: {
      return state
    }
  }
}

export default articleReducer
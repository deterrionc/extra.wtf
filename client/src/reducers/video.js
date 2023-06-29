import {
  NEWSS_LOADED,
  NEWS_LOADED,
  MUSICS_LOADED,
  MUSIC_LOADED
} from '../actions/types';

const initialState = {
  newss: [],
  news: {},
  musics: [],
  music: {}
};

const newsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case NEWSS_LOADED: {
      return {
        ...state,
        newss: payload
      };
    }
    case NEWS_LOADED: {
      return {
        ...state,
        news: payload
      };
    }
    case MUSICS_LOADED: {
      return {
        ...state,
        musics: payload
      };
    }
    case MUSIC_LOADED: {
      return {
        ...state,
        music: payload
      };
    }
    default: {
      return state;
    }
  }
};

export default newsReducer;

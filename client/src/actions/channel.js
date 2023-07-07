import api from '../utils/api';
import formApi from '../utils/formApi';
import {
  CHANNELS_LOADED,
  CHANNEL_LOADED,
  LOGS_LOADED,
  // NEWSS_LOADED,
  // MUSICS_LOADED,
  VIDEOS_LOADED
} from './types';

export const createChannel = (formData, navigate) => async (dispatch) => {
  const res = await formApi.post('/channels/create-channel', formData);

  if (res.data.success) {
    dispatch(getChannels());
    navigate('/dashboard/channels');
  }
};

export const getChannels = () => async (dispatch) => {
  const res = await api.get('/channels/get-channels');

  if (res.data.success) {
    dispatch({
      type: CHANNELS_LOADED,
      payload: res.data.channels
    });
  }
};

export const getChannel = (channelID) => async (dispatch) => {
  const res = await api.get(`/channels/get-channel/${channelID}`);

  if (res.data.success) {
    dispatch({
      type: CHANNEL_LOADED,
      payload: res.data.channel
    });
  }
};

export const updateChannel =
  (channelID, formData, navigate) => async (dispatch) => {
    const res = await api.post(
      `/channels/update-channel/${channelID}`,
      formData
    );

    if (res.data.success) {
      dispatch(getChannels());
      navigate('/dashboard/channels');
    }
  };

export const deleteChannel = (channelID) => async (dispatch) => {
  const res = await api.delete(`/channels/delete-channel/${channelID}`);

  if (res.data.success) {
    dispatch(getChannels());
  }
};

export const getChannelVideos = () => async (dispatch) => {
  const res = await api.get('/channels/get-channel-videos');

  if (res.data.success) {
    // dispatch({
    //   type: NEWSS_LOADED,
    //   payload: res.data.newss
    // })
    // dispatch({
    //   type: MUSICS_LOADED,
    //   payload: res.data.musics
    // })
    dispatch({
      type: VIDEOS_LOADED,
      payload: res.data
    });

    return res.data.videos
  }
};

export const updateVideoPlayedAt = videoID => async dispatch => {
  const res = await api.get(`/channels/update-video-playedAt/${videoID}`)

  if (res.data.success) {
    return true
  }
}

export const getNextVideo = videoID => async dispatch => {
  const res = await api.get(`/channels/get-next-video/${videoID}`)

  if (res.data.success) {
    return res.data.video
  }
}

export const getLastPlayedVideos = () => async dispatch => {
  const res = await api.get('/channels/get-last-played-videos')

  if (res.data.success) {
    dispatch({
      type: LOGS_LOADED,
      payload: res.data.logs
    });
  }
}
import api from "../utils/api"
import { setAlert } from './alert'
import formApi from "../utils/formApi"
import {
  CHANNELS_LOADED,
  CHANNEL_LOADED,
} from "./types"

export const createChannel = (formData, navigate) => async (dispatch) => {
  const res = await formApi.post(`/nchannels/create-channel`, formData)

  if (res.data.success) {
    dispatch(getChannels())
    navigate("/dashboard/nchannels")
  } else {
    dispatch(setAlert(res.data.message, 'error'))
  }
}

export const getChannels = () => async (dispatch) => {
  const res = await api.get("/nchannels/get-channels")

  if (res.data.success) {
    dispatch({
      type: CHANNELS_LOADED,
      payload: res.data.channels,
    })
  }
}

export const getChannel = (channelID) => async (dispatch) => {
  const res = await api.get(`/nchannels/get-channel/${channelID}`)

  if (res.data.success) {
    dispatch({
      type: CHANNEL_LOADED,
      payload: res.data.channel,
    })
  }
}

export const updateChannel = (channelID, formData, navigate) => async (dispatch) => {
  const res = await api.post(`/nchannels/update-channel/${channelID}`, formData)

  if (res.data.success) {
    dispatch(getChannels())
    navigate("/dashboard/nchannels")
  } else {
    dispatch(setAlert(res.data.message, 'error'))
  }
}

export const updateChannelWithImage = (channelID, formData, navigate) => async (dispatch) => {
  const res = await formApi.post(`/nchannels/update-channel-with-image/${channelID}`, formData)

  if (res.data.success) {
    dispatch(getChannels())
    navigate("/dashboard/nchannels")
  } else {
    dispatch(setAlert(res.data.message, 'error'))
  }
}

export const deleteChannel = (channelID) => async (dispatch) => {
  const res = await api.delete(`/nchannels/delete-channel/${channelID}`)

  if (res.data.success) {
    dispatch(getChannels())
  }
}

export const getFirstVideo = async (slug) => {
  const res = await api.get(`/nchannels/get-first-video/${slug}`);

  if (res.data.success) {
    return res.data;
  }
};

export const getNextVideo = async (videoName, videoType, slug) => {
  const res = await api.get(
    `/nchannels/get-next-video/?videoName=${videoName}&type=${videoType}&slug=${slug}`
  );

  if (res.data.success) {
    return res.data.video;
  }
};

export const updatePlayList = async (slug, category, name) => {
  const res = await api.post("/nchannels/update-playlist", {slug, category, name})

  if (res.data.success) {
    return true
  }
}
import api from "../utils/api";
import formApi from "../utils/formApi";
import { CHANNELS_LOADED, CHANNEL_LOADED } from "./types";

export const createChannel = (formData, navigate) => async dispatch => {
  const res = await formApi.post('/channels/create-channel', formData)

  if (res.data.success) {
    dispatch(getChannels())
    navigate('/dashboard/channels')
  }
}

export const getChannels = () => async dispatch => {
  const res = await api.get('/channels/get-channels')

  if (res.data.success) {
    dispatch({
      type: CHANNELS_LOADED,
      payload: res.data.channels
    })
  }
}

export const getChannel = channelID => async dispatch => {
  const res = await api.get(`/channels/get-channel/${channelID}`)

  if (res.data.success) {
    dispatch({
      type: CHANNEL_LOADED,
      payload: res.data.channel
    })
  }
}

export const deleteChannel = channelID => async dispatch => {
  const res = await api.delete(`/channels/delete-channel/${channelID}`)

  if (res.data.success) {
    dispatch(getChannels())
  }
}
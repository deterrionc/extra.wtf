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
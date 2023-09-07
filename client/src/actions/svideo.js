import api from "../utils/api";
import formApi from "../utils/formApi";
import { SVIDEOS_LOADED, SVIDEO_LOADED } from "./types";

export const createSvideo = (formData, navigate) => async dispatch => {
  const res = await formApi.post('/svideos/create-svideo', formData)

  if (res.data.success) {
    dispatch(getSvideos())
    navigate('/dashboard/svideos')
  }
}

export const getSvideos = () => async dispatch => {
  const res = await api.get('/svideos/get-svideos')

  if (res.data.success) {
    dispatch({
      type: SVIDEOS_LOADED,
      payload: res.data.svideos
    })
  }
}

export const getSvideo = svideoID => async dispatch => {
  const res = await api.get(`/svideos/get-svideo/${svideoID}`)

  if (res.data.success) {
    dispatch({
      type: SVIDEO_LOADED,
      payload: res.data.svideo
    })
  }
}

export const updateSvideo = (formData, navigate, svideoID) => async dispatch => {
  const res = await api.post(`/svideos/update-svideo/${svideoID}`, formData)

  if (res.data.success) {
    dispatch(getSvideos())
    navigate('/dashboard/svideos')
  }
}

export const updateSvideoWithImage = (formData, navigate, svideoID) => async dispatch => {
  const res = await formApi.post(`/svideos/update-svideo-with-image/${svideoID}`, formData)

  if (res.data.success) {
    dispatch(getSvideos())
    navigate('/dashboard/svideos')
  }
}

export const updateSvideoWithVideo = (formData, navigate, svideoID) => async dispatch => {
  const res = await formApi.post(`/svideos/update-svideo-with-video/${svideoID}`, formData)

  if (res.data.success) {
    dispatch(getSvideos())
    navigate('/dashboard/svideos')
  }
}

export const updateSvideoWithImageVideo = (formData, navigate, svideoID) => async dispatch => {
  const res = await formApi.post(`/svideos/update-svideo-with-image-video/${svideoID}`, formData)

  if (res.data.success) {
    dispatch(getSvideos())
    navigate('/dashboard/svideos')
  }
}

export const deleteSvideo = svideoID => async dispatch => {
  const res = await api.delete(`/svideos/delete-svideo/${svideoID}`)

  if (res.data.success) {
    dispatch(getSvideos())
  }
}
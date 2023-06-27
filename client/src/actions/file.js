import api from "../utils/api";
import formApi from "../utils/formApi";
import { FILES_LOADED, FILE_LOADED } from "./types";

export const createFile = (formData, navigate) => async dispatch => {
  const res = await formApi.post('/files/create-file', formData)

  if (res.data.success) {
    dispatch(getFiles())
    navigate('/dashboard/files')
  }
}

export const getFiles = () => async dispatch => {
  const res = await api.get('/files/get-files')
  console.log(res.data)

  if (res.data.success) {
    dispatch({
      type: FILES_LOADED,
      payload: res.data.files
    })
  }
}

export const getFile = fileID => async dispatch => {
  const res = await api.get(`/files/get-file/${fileID}`)

  if (res.data.success) {
    dispatch({
      type: FILE_LOADED,
      payload: res.data.file
    })
  }
}

export const deleteFile = fileID => async dispatch => {
  const res = await api.delete(`/files/delete-file/${fileID}`)

  if (res.data.success) {
    dispatch(getFiles())
  }
}
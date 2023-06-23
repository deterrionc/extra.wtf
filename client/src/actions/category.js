import api from "../utils/api";
import { CATEGORIES_LOADED, CATEGORY_LOADED } from "./types";
import { setAlert } from "./alert";

export const createCategory = (formData, navigate) => async dispatch => {
  const res = await api.post('/categories/create-category', formData)

  if (res.data.success) {
    dispatch(getCategories())
    navigate('/dashboard/categories')
  } else {
    dispatch(setAlert(res.data.message, 'danger'))
  }
}

export const getCategories = () => async dispatch => {
  const res = await api.get('/categories/get-categories')

  if (res.data.success) {
    dispatch({
      type: CATEGORIES_LOADED,
      payload: res.data.categories
    })
  }
}

export const getCategory = categoryID => async dispatch => {
  const res = await api.get(`/categories/get-category/${categoryID}`)

  if (res.data.success) {
    dispatch({
      type: CATEGORY_LOADED,
      payload: res.data.category
    })
  }
}

export const updateCategory = (categoryID, formData, navigate) => async dispatch => {
  const res = await api.post(`/categories/update-category/${categoryID}`, formData)

  if (res.data.success) {
    dispatch(getCategories())
    navigate('/dashboard/categories')
  }
}

export const deleteCategory = categoryID => async dispatch => {
  const res = await api.delete(`/categories/delete-category/${categoryID}`)

  if (res.data.success) {
    dispatch(getCategories())
  }
}
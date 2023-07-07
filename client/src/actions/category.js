import api from '../utils/api';
import { CATEGORIES_LOADED, CATEGORY_LOADED } from './types';
import { setAlert } from './alert';
import { getFiles } from './file';
import { setLoading } from './spinner';
import formApi from '../utils/formApi';

export const createCategory = (formData, navigate) => async (dispatch) => {
  const res = await api.post('/categories/create-category', formData);

  if (res.data.success) {
    dispatch(getCategories());
    navigate('/dashboard/categories');
  } else {
    dispatch(setAlert(res.data.message, 'danger'));
  }
};

export const getCategories = () => async (dispatch) => {
  const res = await api.get('/categories/get-categories');

  if (res.data.success) {
    dispatch({
      type: CATEGORIES_LOADED,
      payload: res.data.categories
    });
  }
};

export const getCategory = (categoryID) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await api.get(`/categories/get-category/${categoryID}`);

  if (res.data.success) {
    dispatch({
      type: CATEGORY_LOADED,
      payload: res.data.category
    });
    dispatch(setLoading(false));
  }
};

export const getCategoryVideos = (categoryID) => async (dispatch) => {
  const res = await api.get(`/categories/get-category-videos/${categoryID}`);

  if (res.data.success) {
    dispatch({});
  }
};

export const updateCategory =
  (categoryID, formData, navigate) => async (dispatch) => {
    const res = await api.post(
      `/categories/update-category/${categoryID}`,
      formData
    );

    if (res.data.success) {
      dispatch(getCategories());
      navigate('/dashboard/categories');
    }
  };

export const deleteCategory = (categoryID) => async (dispatch) => {
  const res = await api.delete(`/categories/delete-category/${categoryID}`);

  if (res.data.success) {
    dispatch(getCategories());
  }
};

export const removeFromCategory = (categoryID, videoID) => async (dispatch) => {
  dispatch(setLoading(true))
  const res = await api.post('/categories/remove-from-category', {
    categoryID,
    videoID
  })

  if (res.data.success) {
    dispatch(getCategory(categoryID))
    dispatch(getFiles())
    dispatch(setLoading(false))
  }
}


export const addVideoToCategory = (categoryID, file) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await api.post('/categories/add-video-to-category', {
    categoryID,
    file
  });

  if (res.data.success) {
    dispatch(getCategory(categoryID));
    dispatch(getFiles());
    dispatch(setLoading(false));
  }
};

export const uploadVideoToCategory = (categoryID, formData) => async dispatch => {
  const res = await formApi.post(`/categories/upload-video/${categoryID}`, formData)

  if (res.data.success) {
    return true
  }
}

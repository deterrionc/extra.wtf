import api from "../utils/api";
import formApi from "../utils/formApi";
import { ARTICLES_LOADED, ARTICLE_LOADED } from "./types";

export const createArticle = (formData, navigate) => async dispatch => {
  const res = await formApi.post('/articles/create-article', formData)

  if (res.data.success) {
    dispatch(getArticles())
    navigate('/dashboard/articles')
  }
}

export const getArticles = () => async dispatch => {
  const res = await api.get('/articles/get-articles')

  if (res.data.success) {
    dispatch({
      type: ARTICLES_LOADED,
      payload: res.data.articles
    })
  }
}

export const getArticle = articleID => async dispatch => {
  const res = await api.get(`/articles/get-article/${articleID}`)

  if (res.data.success) {
    dispatch({
      type: ARTICLE_LOADED,
      payload: res.data.article
    })
  }
}

export const deleteArticle = articleID => async dispatch => {
  const res = await api.delete(`/articles/delete-article/${articleID}`)

  if (res.data.success) {
    dispatch(getArticles())
  }
}
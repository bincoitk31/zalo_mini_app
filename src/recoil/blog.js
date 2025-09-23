import { getApi } from "../utils/request"
import { atom } from "recoil"

export const blogHomeState = atom({
  key: "blogHome",
  default: null
})

export const articleState = atom({
  key: "article",
  default: ""
})

export const blogStore = (type, payload = {}) => {
  const getArticles = async () => {
    return await getApi(`/blogs/articles`, {params: payload})
  }
  const getBlogs = async () => {
    return await getApi(`/blogs`, {params: payload})
  }
  const getAllArticles = async () => {
    return await getApi(`/blogs/all_articles`, {params: payload})
  }

  const getArticle = async () => {
    return await getApi(`/blogs/article`, {params: payload})
  }

  const obj = {
    getArticles,
    getBlogs,
    getAllArticles,
    getArticle
  }

  return obj[type](payload)
}
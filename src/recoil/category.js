import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { getApi } from "../utils/request"

export const categoriesState = atom({
  key: "categories",
  default: []
})

export const categoryChooseState = atom({
  key: "categoryChoose",
  default: null
})

export const termSearchState = atom({
  key: "termSearchProduct",
  default: ''
})

export const categoriesHomeState = atom({
  key: "categoriesHome",
  default: []
})

export const categoryStore = (type, payload = {}) => {
  const getCategories = async () => {
    return await getApi("/categories")
  }

  const getCategoryById = async () => {
    return await getApi(`/categories/products_new`, {params: payload})
  }

  const searchProducts = async () => {
    console.log(payload, "payloadddd termmm")
    return await getApi(`/search`, { params: payload })
  }

  const obj = {
    getCategories,
    getCategoryById,
    searchProducts
  }

  return obj[type](payload)
}
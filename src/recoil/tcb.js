import { atom } from "recoil"
import { getApiAxios, postApiAxios } from "../utils/request"

const API_URL = import.meta.env.VITE_ENV == 'DEV' ? 'http://localhost:24679' : import.meta.env.VITE_ENV == 'STAGING' ? "https://api.staging.storecake.io" : "https://api.storecake.io"

export const orderTransactionState = atom({
  key: "orderTransaction",
  default: {}
})

export const vituarlBankAccountState = atom({
  key: "vituarlBankAccount",
  default: null
})

export const loadingDetailState = atom({
  key: "loadingDetail",
  default: false
})

export const visibleCancelTransactionState = atom({
  key: "visibleCancelTransaction",
  default: false
})

export const errorFetchDetailState = atom({
  key: "errorFetchDetail",
  default: false
})

export const errorFetchDetailMessageState = atom({
  key: "errorFetchDetailMessage",
  default: null
})

export const siteState = atom({
  key: "site",
  default: {}
})

export const orderState = atom({
  key: "order",
  default: {}
})

export const tcbStore = (type, payload = {}) => {
  const getOrderDetail = async () => {
    let url = `${API_URL}/api/v1/payment/storecake/tcb/${payload.siteId}/order/${payload.orderRenderId}`
    return await getApiAxios(url)
  }

  const cancelOrderTransaction = async () => {
    let url = `${API_URL}/api/v1/payment/storecake/tcb/${payload.siteId}/order/${payload.orderRenderId}/cancel`
    return await postApiAxios(url)
  }
  const obj = {
    getOrderDetail,
    cancelOrderTransaction
  }

  return obj[type](payload)
}

import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { getApi } from "../utils/request"

export const totalPriceState = atom({
  key: "totalPrice",
  default: 0
})

export const amountPriceState = atom({
  key: "amountPrice",
  default: 0
})

export const cartItemsState = atom({
  key: "cartItems",
  default: []
})

export const customerInfoState = atom({
  key: "customerInfo",
  default: null
})

export const openCartState = atom({
  key: "openCart",
  default: false
})

export const openAddAddressState = atom({
  key: "openAddAddress",
  default: false
})

export const listAddressState = atom({
  key: "listAddress",
  default: []
})

export const editAddressState = atom({
  key: "editAddress",
  default: null
})

export const discountCouponState = atom({
  key: 'discountCoupon',
  default: 0
})

export const shippingFeeState = atom({
  key: 'shippingFee',
  default: 0
})

export const orderStore = (type, payload = {}) => {
  const getShippingFee = async () => {
    return await getApi("/orders/shipping_fee", {params: payload})
  }

  const getPriceShipOrders = async () => {
    return await getApi("/orders/price_ship_orders", {params: payload})
  }

  const getProductByIds = async () => {
    return await getApi("/products/get_product_by_ids", {params: payload})
  }

  const obj = {
    getShippingFee,
    getProductByIds,
    getPriceShipOrders
  }

  return obj[type](payload)
}

import { atom, selector } from "recoil"

export const productState = atom({
  key: "product",
  default: {},
})

export const retailPriceState = selector({
  key: "retailPrice",
  get: ({get}) => {
    let product = get(productState)
    return product
  }
})

export const drawerAddCartState = atom({
  key: "drawerAddCart",
  default: false
})

export const typeAddCartState = atom({
  key: "typeAddCart",
  default: ''
})
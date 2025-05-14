import { selector } from "recoil";
import { getUserInfo } from "zmp-sdk/apis";
import { cartItemsState } from "./order";
import { setDataToStorage } from "../utils/tools";

export const userState = selector({
  key: "user",
  get: () =>
    getUserInfo({
      avatarType: "normal",
    }),
});

export const addCartState = selector({
  key: "AddCardState",
  get: () => {},
  set: ({set, get}, item) => {
    let cartItems = get(cartItemsState)

    let idx = cartItems.findIndex(el => el.id == item.id)
    let newCartItems = idx > -1
      ? cartItems.map((el, index) =>
        index === idx ? {...el, quantity: el.quantity + item.quantity} : el
        )
      : [...cartItems, item]

    set(cartItemsState, newCartItems)
    setDataToStorage("cart-items", newCartItems)
  }
})
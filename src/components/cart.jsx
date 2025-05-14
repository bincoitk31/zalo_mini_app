import React from "react"
import { Drawer, Button, message } from 'antd'
import { openCartState } from "../recoil/order"
import { useRecoilState, useRecoilValue } from "recoil"
import { X, DotOutline } from '@phosphor-icons/react'
import { totalPriceState, cartItemsState } from "../recoil/order"
import { formatNumber } from "../utils/formatNumber"
import { useNavigate } from "react-router-dom"
import CartItems from "./cart-items"
import { setDataToStorage } from "../utils/tools"

const Cart = () => {
  const navigate = useNavigate()
  const [openCart, setOpenCart] = useRecoilState(openCartState)
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)
  const totalPrice = useRecoilValue(totalPriceState)

  const onClose = () => {
    setOpenCart(false)
  }

  const submitOrder = () => {
    onClose()
    navigate('/checkout')

  }

  const removeCart = () => {
    setCartItems([])
    setDataToStorage("cart-items", [])
  }

  return (
    <Drawer
      placement={'bottom'}
      closable={false}
      onClose={onClose}
      open={openCart}
      className="custom-drawer"
      height={'auto'}
    >
      <div>
        <div className="flex p-3 border-b border-b-solid border-b-[#dcdcdc]">
          <div className="flex-1 text-center font-bold text-[16px]">Giỏ hàng</div>
          <div onClick={onClose}>
            <X size={20} color="#292929" weight="light" />
          </div>
        </div>
        <div className="p-3">
          <div className="flex justify-between">
            <div className="font-bold text-[14px]">Chi tiết đơn hàng ({(cartItems || []).length || 0})</div>
            <div className="text-red-600" onClick={removeCart}>Xóa hết</div>
          </div>
          <div>
            <CartItems />
          </div>
        </div>
        <div className="px-3 pt-3 border-t border-t-solid border-t-[#fafafa]">
          <div className="flex justify-between">
            <div>Tổng thanh toán:</div>
            <div className="font-medium"> {formatNumber(totalPrice)} </div>
          </div>
          <div className="w-full">
            <Button disabled={(cartItems || []).length == 0 ? true : false} color="default" variant="solid" className="w-full h-[36px] my-2 rounded-[4px]" onClick={submitOrder}> 
              <div className="flex font-bold">
              <span>Thanh toán ngay</span>
              <span><DotOutline size={20} color="#fff" weight="fill" /></span>
              <span>{(cartItems || []).length || 0}</span>
              <span className="pl-1">sản phẩm</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
export default Cart
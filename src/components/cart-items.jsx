import React, { useEffect} from "react";
import { cartItemsState, totalPriceState, amountPriceState } from "../recoil/order"
import { useRecoilValue, useRecoilState } from "recoil"
import { formatNumber } from ".././utils/formatNumber"
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { resizeLink, setDataToStorage, getDataToStorage } from "../utils/tools"
import Quantity from "./quantity";

const CartItems = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)
  const [totalPrice, setTotalPrice] = useRecoilState(totalPriceState)
  const [amountPrice, setAmountPrice] = useRecoilState(amountPriceState)

  const handleRemove = (item) => {
    let newCartItems = cartItems.filter(el => el.id != item.id)
    setCartItems(newCartItems)
    setDataToStorage("cart-items", newCartItems)
  }

  const renderFields = (vari) => {
    const fields = vari.fields.map(el => el.value)

    return (
      <div>
        { fields.join(" / ") }
      </div>
    )
  }

  const calcTotalPrice = () => {
    let new_total = cartItems.reduce((acc, el) => {
      console.log(el)
      return acc += el.retail_price * el.quantity
    }, 0)

    setTotalPrice(new_total)
  }


  useEffect(() => {
    let cartItemsLocal = getDataToStorage("cart-items")
    setCartItems(cartItemsLocal)
  }, [])

  useEffect(() => {
      calcTotalPrice()
      setDataToStorage("cart-items", cartItems)
    }, [cartItems])

  return (
    <div className="">
      {
        cartItems.length == 0
        ?
        <div> Vui lòng thêm sản phẩm vào giỏ hàng!</div>
        :
        cartItems.map((el, idx) => (
          <div className={idx == cartItems.length - 1 ? 'flex py-4 justify-between' : 'flex py-4 justify-between border-b boder-b-solid border-b-[#f2f2f2]'} key={idx}>
            <div className="flex flex-1">
              <div className="min-w-[60px] w-[60px] h-[60px]" onClick={() => navigate(`/product/${el.product_id}`)}>
                <img className="w-full h-full rounded-md" src={resizeLink(el ?.images[0])} />
              </div>
              <div className="px-2 flex flex-col justify-between max-w-[190px]">
                <div className="pb-1 font-medium truncate" onClick={() => navigate(`/product/${el.product_id}`)}>{el.name}</div>
                <div className="">{renderFields(el)}</div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end">
              <div className="">{formatNumber(el.retail_price)}</div>
              <div className=""><Quantity item={el} /></div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default CartItems
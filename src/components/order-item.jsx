import React from "react";
import { formatNumber } from "../utils/formatNumber"
import { useNavigate } from "react-router-dom";
import { productState } from "../recoil/product";
import { useSetRecoilState } from "recoil";
import { resizeLink } from "../utils/tools"

const OrderItem = ({order}) => {
  const navigate = useNavigate()
  const setProductView = useSetRecoilState(productState)
  console.log(order, "Itemmmmm")

  const totalQuantity = (orders) => {
    return orders.reduce((acc, el) => acc += el.quantity, 0)
  }

  const goToProduct = (id) => {
    navigate(`/product/${id}`)
    setProductView(product)
  }

  return (
    <div className="bg-[#fff] rounded-lg p-2 m-2">
      <div>
        {order.order_items.map((el, idx) => (
          <>
            <div className={idx == order.order_items.length - 1 ? 'py-4 justify-between' : 'py-4 justify-between border-b boder-b-solid border-b-[#f2f2f2]'} key={idx}>
              <div className="flex">
                <div className="min-w-[60px] w-[60px] h-[60px]" onClick={() => goToProduct(el.variation_info.product_id)}>
                  <img className="w-full h-full rounded-md" src={resizeLink(el.variation_info ?.images[0])} />
                </div>
                <div className="px-2 flex flex-col justify-between w-full">
                  <div className="pb-1 font-medium" onClick={() => goToProduct(el.variation_info.product_id)}>{el.variation_info.name}</div>
                  <div className="flex justify-between">
                    <div className="">{formatNumber(el.variation_info.retail_price)}</div>
                    <div className="">x{el.quantity}</div>
                  </div>
                </div>
              </div>
            
            </div>
          </>
        ))}
      </div>
      <div className="text-end">Tổng số tiền ({totalQuantity(order.order_items)} sản phẩm): <span className="font-bold">{formatNumber(order.invoice_value)}</span></div>
    </div>
  )
}

export default OrderItem
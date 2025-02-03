import React from "react"
import { totalPriceState, amountPriceState, cartItemsState } from "../recoil/order"
import {  useRecoilValue } from "recoil"
import { formatNumber } from "../utils/formatNumber"
import { Button } from "antd"
import { useNavigate } from "react-router-dom"

const Bill = () => {
  const navigate = useNavigate()
  const totalPrice = useRecoilValue(totalPriceState)
  const amountPrice = useRecoilValue(amountPriceState)

  return (
    <div className="p-3">
      <div className="">
        <div className="font-bold pb-2"> Thanh toán</div>
        <div>
          <div className="flex justify-between pb-1 text-zinc-500">
            <div>Tạm tính: </div>
            <div>{formatNumber(totalPrice)}</div>
          </div>
          <div className="flex justify-between pb-1 text-zinc-500">
            <div>Phí vận chuyển:</div>
            <div>{formatNumber(0)}</div>
          </div>
          <div className="flex justify-between pb-1 text-orange-600">
            <div>Giảm giá:</div>
            <div>{formatNumber(0)}</div>
          </div>
          <div className="flex justify-between pb-1">
            <div className="font-bold">Số tiền phải thanh toán:</div>
            <div>{formatNumber(amountPrice)}</div>
          </div>
        </div>
        <div className="border-b border-dashed border-[#a0a2a4ff] my-2"></div>
        {/* <div className="flex flex-col">
          <Button onClick={() => navigate("/checkout")} className="w-full mb-4 font-bold uppercase" type="primary" danger>Tiến hành đặt hàng</Button>
          <Button onClick={() => navigate("/")} className="w-full font-bold uppercase" type="primary" danger>Mua thêm sản phẩm</Button>
        </div> */}
       
      </div>
    </div>
  )
}

export default Bill
import React from "react"
import { totalPriceState, amountPriceState, discountCouponState, shippingFeeState } from "../recoil/order"
import {  useRecoilValue } from "recoil"
import { formatNumber } from "../utils/formatNumber"

const Bill = () => {
  const totalPrice = useRecoilValue(totalPriceState)
  const amountPrice = useRecoilValue(amountPriceState)
  const discountCoupon = useRecoilValue(discountCouponState)
  const shippingFee = useRecoilValue(shippingFeeState)

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
            <div>{formatNumber(shippingFee)}</div>
          </div>
          <div className="flex justify-between pb-1 text-orange-600">
            <div>Giảm giá:</div>
            <div>{formatNumber(discountCoupon)}</div>
          </div>
          <div className="flex justify-between pb-1">
            <div className="font-bold">Số tiền phải thanh toán:</div>
            <div>{formatNumber(amountPrice)}</div>
          </div>
        </div>
        <div className="border-b border-dashed border-[#a0a2a4ff] my-2"></div>
      </div>
    </div>
  )
}

export default Bill
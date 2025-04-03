import React, { useState} from "react"
import { Payment } from "zmp-sdk/apis";
import { Button } from "antd";
import { totalPriceState, cartItemsState } from "../recoil/order";
import { useRecoilValue } from "recoil";

const PaymentMethod = () => {
  const [payment, setPayment] = useState({logo: 'https://stc-zmp.zadn.vn/payment/cod.png', displayName: "Thanh toán khi nhận hàng"})
  const totalPrice = useRecoilValue(totalPriceState)
  const cartItems = useRecoilValue(cartItemsState)

  const handlePaymentMethod = () => {
    Payment.selectPaymentMethod({
      channels: [
        { method: "COD" },
      ],
      success: (data) => {
        // Lựa chọn phương thức thành công
        const { method, isCustom, logo, displayName, subMethod } = data;
        console.log(data, "dataa")
        setPayment(data)
      },
      fail: (err) => {
        // Tắt trang lựa chọn phương thức hoặc xảy ra lỗi
        console.log(err);
      },
    });
  }

  return (
    <div className="p-3 border-b-[8px] border-b-solid border-b-[#efefef]">
      <div className="flex justify-between items-center">
        <div className="font-bold">Phương thức thanh toán</div>
      </div>
      <div className="pt-2">
        <Button onClick={() => handlePaymentMethod()}>
          {
            !payment &&
            <div>Chọn phương thức thanh toán</div>
          }
          { payment &&
            <div className="flex items-center">
              <div className="w-[20px] h-[20px]">
                <img className="w-full h-full" src={payment.logo} />
              </div>
              <span className="pl-2">{payment.displayName}</span>
            </div>
          }
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethod
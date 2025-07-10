import React, { useState, useEffect } from "react"
import { Payment } from "zmp-sdk/apis";
import { Button } from "antd";

import { orderStore, paymentMethodState } from "../recoil/order";
import { useRecoilState } from "recoil";

const PaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState([{method: 'COD'}])
  const [payment, setPayment] = useRecoilState(paymentMethodState)

  const handlePaymentMethod = () => {
    const channels = paymentMethods.map(el => ({method: el.method})) || [{method: 'COD'}]
    Payment.selectPaymentMethod({
      channels,
      success: (data) => {
        // Lựa chọn phương thức thành công
        console.log(data, 'payment selectedd')
        const { method, isCustom, logo, displayName, subMethod } = data;
        setPayment(data)
      },
      fail: (err) => {
        // Tắt trang lựa chọn phương thức hoặc xảy ra lỗi
        console.log(err);
      },
    });
  }

  useEffect(() => {
    const params = {
      mini_app_id: import.meta.env.VITE_APP_ID
    }

    orderStore('getPaymentMethods', params)
    .then(res => {
      console.log(res, 'res payment methods')
      if(res.status == 200 && res.data.result.error == 0) {
        const paymentsActive = res.data.result.paymentChannels.filter(el => el.status == "ACTIVE")
        setPaymentMethods(paymentsActive)
      }
    })
  }, [])

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
import React, { useEffect, useState } from "react"
import { orderTransactionState, orderState, errorFetchDetailState, errorFetchDetailMessageState } from "../../recoil/tcb"
import { useRecoilState } from "recoil"
import { useNavigate } from "react-router-dom"

const TcbTransactionError = () => {
  const navigate = useNavigate()
  const [second, setSecond] = useState(3)
 
  const [orderTransaction, setOrderTransaction] = useRecoilState(orderTransactionState)
  const [order, setOrder] = useRecoilState(orderState)
  const [errorFetchDetail, setErrorFetchDetail] = useRecoilState(errorFetchDetailState)
  const [errorFetchDetailMessage, setErrorFetchDetailMessage] = useRecoilState(errorFetchDetailMessageState)


  useEffect(() => {
    if (second === 0) return
    const interval = setInterval(() => {
      setSecond(second - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [second])

  useEffect(() => {
    if (second <= 0) {
      navigate('/')
    }
  }, [second, navigate])

  return (
    <div className="flex items-center justify-center m-4">
      <div className="w-full p-4 pb-8 border-theme-border rounded-2xl flex justify-center flex-col items-center text-base bg-white">
        <div className="w-[240px] h-[240px] flex justify-center items-center">
          <img src="https://content.pancake.vn/web-media/36/cc/cf/23/49fbe8802da54548df65d9495e2c6f01984250ca3dd500d868a83518.svg"/>
        </div>

        <div className="font-medium text-xl mt-3 mb-2">Thanh toán không thành công</div>
        {
          orderTransaction.is_cancel ? (
            <div className="text-center text-sm font-medium">Giao dịch đã bị từ chối bởi người dùng</div>
          ) : orderTransaction.is_expired ? (
            <div className="text-center text-sm font-medium">Giao dịch đã hết hạn</div>
          ) : errorFetchDetail ? (
            <div className="text-center text-sm font-medium">{errorFetchDetailMessage || "Xảy ra lỗi hệ thống"}</div>
          ) : null
        }
        {
          !errorFetchDetail ? (
            <div className="mt-4 p-4 rounded text-center bg-[#F3F4F4] px-6 py-2 w-fit min-w-[222px]">
              <div>
                Số tiền
              </div>
              <div className="text-xl font-medium rounded mt-1">
                {order.invoice_value}
              </div>
            </div>
          ) : null
        }

        <div className="mt-4 text-sm">
          <div className="flex"> Trở lại trang mua hàng trong <div className="text-[#1db954] ml-1">{second}s...</div></div>
        </div>
      </div>
    </div>
  )
}

export default TcbTransactionError
import React, { useEffect, useState } from "react"
import { CheckCircle } from "@phosphor-icons/react"
import { Button } from "antd"
import { useNavigate } from "react-router-dom"

const TcbTransactionSuccess = () => {
  const navigate = useNavigate()
  const [second, setSecond] = useState(3)

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
    <div
      className="mb-4 p-4 pb-8 bg-white rounded-lg flex justify-center flex-col items-center text-base"
    >
      <div className="text-xl font-semibold my-8">Thông tin giao dịch</div>
      <div className="text-[#1db954]"><CheckCircle size={100} /></div>
      <div>Đơn hàng của bạn đã thanh toán thành công</div>
      <div className="mt-2 font-semibold text-[#1db954]">
        <div>Tự động chuyển hướng sau {second} giây</div>
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={() => navigate('/')}>Tiếp tục mua hàng</Button>
      </div>
    </div>
  )
}

export default TcbTransactionSuccess
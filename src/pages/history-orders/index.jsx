import React, { useEffect, useState } from "react"
import { Tabs, Empty, Button } from 'antd'
import { getApi } from '../../utils/request'
import { useRecoilState } from "recoil"
import { customerState } from "../../recoil/member"
import { useNavigate } from "react-router-dom"

import OrderItem from "../../components/order-item"

const HistoryOrder = () => {
  const navigate = useNavigate()
  const [customer, setCustomer] = useRecoilState(customerState)
  const [activeKey, setActiveKey] = useState(-1)
  const [orders, setOrders] = useState([])

  const children = (key) => {
    return (
      <div>
        { customer ?.id
        ?
          orders.length == 0
          ?
           <Empty className="pt-4" description="Bạn chưa có đơn hàng nào cả" />
          :
            <div className="overflow-y-auto h-[calc(100vh-140px)]">
              {
                orders.map(order => <OrderItem order={order} />)
              }
         </div>
        :
          <div className="flex justify-center w-full">
            <Button onClick={() => navigate('/member')}>Đăng kí thành viên để tra cứu lịch sử đơn hàng</Button>
          </div>
        }
      </div>
    )
  }

  const getOrders = async (status = -1, page = 1, limit = 10) => {
    setActiveKey(status)
    if (!customer ?.id) return
    let data = {
      status,
      page,
      limit,
      id: customer.id
    }

    const res = await getApi("orders/tracking_order", {params: data})

    if (res.status == 200) {
      if (status == activeKey) setOrders(res.data.result.orders)
    }
  }

  const items = [
    {
      key: -1,
      label: <div>Tất cả</div>,
      children: children(-1),
    },
    {
      key: 0,
      label: <div>Chờ xác nhận</div>,
      children: children(0),
    },
    {
      key: 1,
      label: <div>Chờ lấy hàng</div>,
      children: children(1),
    },
    {
      key: 2,
      label: <div>Chờ giao hàng</div>,
      children: children(2),
    },
    {
      key: 3,
      label: <div>Đã giao</div>,
      children: children(3),
    },
  ];

  const onChange = (key) => {
    setOrders([])
    setActiveKey(key)
  }

  useEffect(() => {
    getOrders(activeKey)
  }, [activeKey])

  return (
    <>
      <div className="absolute top-[44px] bg-[#f3f3f3] h-[calc(100vh-36px)] overflow-y-auto w-full">
        <Tabs activeKey={activeKey} className="custom-tabs" defaultActiveKey="-1" items={items} onChange={onChange} />
      </div>

    </>
  )
}

export default HistoryOrder

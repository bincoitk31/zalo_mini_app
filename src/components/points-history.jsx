import React, { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { CaretLeft, X } from "@phosphor-icons/react"
import { Drawer } from "antd"
import { openPointsHistoryState, customerState } from "../recoil/member"
import { memberStore } from "../recoil/member"

const PointsHistory = () => {
  const [customer, setCustomer] = useRecoilState(customerState)
  const [openPointsHistory, setOpenPointsHistory] = useRecoilState(openPointsHistoryState)
  const [logs, setLogs] = useState([
    {
        "amount": 3.5,
        "created_at": "2025-06-16T03:19:00",
        "current_point": 66.16,
        "id": 2881313,
        "note": "Nhận được điểm từ đơn hàng thành công #457"
    },
    {
        "amount": 13.1,
        "created_at": "2025-06-05T08:42:42",
        "current_point": 62.66,
        "id": 1230255080,
        "note": "Nhận được điểm từ đơn hàng thành công #411"
    },
    {
        "amount": 33.56,
        "created_at": "2025-05-19T02:24:24",
        "current_point": 49.56,
        "id": 2589778,
        "note": "Nhận được điểm từ đơn hàng thành công #361"
    },
    {
        "amount": -10,
        "created_at": "2025-05-19T02:24:23",
        "current_point": 16,
        "id": 2589777,
        "note": "Nhận được điểm từ đơn hàng thành công #360"
    }
  ])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(false)
  
  const onClose = () => {
    setOpenPointsHistory(false)
  }

  const formatDate = (time) => {
    const date = new Date(time)
    const date_string = new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      day: "2-digit", month: "2-digit", year: "2-digit",
      hourCycle: "h23"
    }).format(date)
    return date_string
  }

  const loadMore = () => {
    setPage(page + 1)
    memberStore('getPointsHistory', {
      pos_customer_id: customer.pos_info.id,
      page: page,
      limit: limit
    })
    .then((res) => {
      if (res.status == 200) {
        setLogs([...logs, ...res.data.point_logs.data])
        setTotal(res.data.point_logs.count)
      }
    })
    .finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    if (customer ?.pos_info ?.id) {
      memberStore('getPointsHistory', {
        pos_customer_id: customer.pos_info.id,
        page: 1,
        limit: 20
      })
      .then((res) => {
        if (res.status == 200) {
          setLogs(res.data.point_logs.data)
          setTotal(res.data.point_logs.count)
          }
        })
    }
  }, [])

  return (
    <div>
      <Drawer
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={openPointsHistory}
        className="custom-drawer"
        height={'calc(100vh - 36px)'}
      >
        <div className="">
          <div className="bg-white text-gray-800 overflow-hidden w-full max-w-sm flex flex-col">
            <div className="p-2 flex items-center bg-black text-white border-b border-gray-200">
              <CaretLeft onClick={onClose} size={20} weight="bold" />
              <span className="font-bold">Lịch sử điểm</span>
            </div>

            <div className="flex-grow overflow-y-auto bg-gray-200 h-[calc(100vh-36px)]">
              <div className="px-4 text-gray-900">
                  <p className="text-lg text-gray-600">Bạn có:</p>
                  <h1 className="text-3xl font-bold mt-1">{customer ?.pos_info ?.reward_point || 0} điểm</h1>
              </div>
              {
                logs.length > 0 &&
                  <div className="mt-3">
                    {
                      logs.map((item, index) => (
                        <div className="bg-gray-50 p-4 mx-4 rounded-lg mb-4 shadow-sm border border-gray-200" key={index}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              {
                                item.amount > 0
                                ?
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  <div className="text-green-600 text-sm font-medium">+{item.amount}</div>
                                </div>
                                :
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                  <div className="text-red-600 text-sm font-medium">{item.amount}</div>
                                </div>
                              }
                            </div>
                            <div className="text-gray-800 text-sm">{formatDate(item.created_at)}</div>
                          </div>
                          <div className="text-gray-600 text-sm">{item.note}</div>
                        </div>
                      ))
                    }
                    {
                      total > logs.length &&
                      <div className="text-center pb-4 pt-2">
                        <button className="text-blue-600 font-semibold text-sm hover:underline" onClick={loadMore}>
                            <span>{loading ? 'Đang tải...' : 'Xem thêm'}</span>
                        </button>
                      </div>
                    }
                  </div>
              }
             

            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default PointsHistory
import React, { useEffect, useState } from "react"
import { Button } from "antd"
import { CaretRight, Check, Circle, Plus, Flag } from '@phosphor-icons/react'
import { useRecoilState } from "recoil"
import { openAddAddressState, listAddressState, customerInfoState, editAddressState } from "../../recoil/order"
import { useNavigate } from "react-router-dom"
import { setDataToStorage } from "../../utils/tools"

const Address = () => {
  const navigate = useNavigate()
  const [openAddAddress, setOpenAddAddress] = useRecoilState(openAddAddressState)
  const [listAddress, setListAddress] = useRecoilState(listAddressState)
  const [customerInfo, setCustomerInfo] = useRecoilState(customerInfoState)
  const [editAddress, setEditAddress] = useRecoilState(editAddressState)

  const handleAccept = () => {
    navigate("/checkout")
  }

  const handleAdd = () => {
    setOpenAddAddress(true)
  }

  const handleSelectDefault = (value) => {
    let newListAddress = listAddress.map(el => {
      if (el.id == value.id) return {...el, default: true}
      return {...el, default: false}
    })
    setListAddress(newListAddress)
    localStorage.setItem('list-address', JSON.stringify(newListAddress))
    setCustomerInfo(value)
  }

  const handleEditAddress = (e, address) => {
    e.stopPropagation()
    setOpenAddAddress(true)
    setEditAddress(address)
  }

  useEffect(() => {
    const list_address = JSON.parse(localStorage.getItem('list-address') || '[]')
    setListAddress(list_address)
  }, [])

  useEffect(() => {
    setDataToStorage('customer-info', customerInfo)
  }, [customerInfo])

  return(
    <>
      <div className="absolute top-[44px] bg-[#f3f3f3] h-[calc(100vh-89px)] overflow-y-auto w-full">
        <div className="px-3 pt-4">
          <div className="font-bold">Đơn hàng sẽ được gửi đến địa chỉ này !</div>
            { listAddress.length > 0 &&
              listAddress.map(el => (
                el.default &&
                  <div className="pt-3">
                    <div className="relative bg-[#fff] p-3 border border-solid border-[#000] rounded-lg flex justify-between">
                      <div className="">
                        <div className="font-bold pb-1">{el.full_name}</div>
                        <div className="text-zinc-500 text-[12px] pb-1">{el.phone_number}</div>
                        <div className="text-zinc-500 text-[12px] pb-1">{el.decode_address}</div>
                        <div className="flex items-center bg-[#d9d9d9] rounded-full w-fit px-2">
                          <Flag size={14} color="#000" weight="light" />
                          <span className="text-[10px] pl-1">Mặc định</span>
                        </div>
                      </div>
                      <div onClick={(e) => handleEditAddress(e, el)} className="flex items-center">
                        <CaretRight size={24} color="#000000" weight="light" />
                      </div>
                      <div className="flex items-center justify-center absolute top-0 right-0 bg-[#000000] rounded-tr-lg rounded-bl-[12px] w-[26px] h-[26px]">
                        <Check size={20} color="#ffffff" weight="light" />
                      </div>
                    </div>
                  </div>
              ))
            }
            <div className="pt-3">
              <div className="text-zinc-500 pb-2">Hoặc chọn địa chỉ đã lưu</div>
              {listAddress.length > 0 &&
                listAddress.map(el => (
                  !el.default &&
                    <div onClick={() => handleSelectDefault(el)} className="relative bg-[#fff] mb-3 p-3 rounded-lg flex justify-between">
                      <div>
                        <Circle size={24} color="#cccccc" weight="light" />
                      </div>
                      <div className="flex-1 pl-2">
                        <div className="font-bold pb-1">{el.full_name}</div>
                        <div className="text-zinc-500 text-[12px] pb-1">{el.phone_number}</div>
                        <div className="text-zinc-500 text-[12px] pb-1">{el.decode_address}</div>
                      </div>
                      <div onClick={(e) => handleEditAddress(e, el)} className="flex items-center">
                        <CaretRight size={24} color="#000000" weight="light" />
                      </div>
                    </div>
                ))
              }
            </div>
           
          

          <div className="">
            <div onClick={handleAdd} className="flex justify-between items-center p-3 bg-[#fff] rounded-lg">
              <div className="font-bold">Thêm địa chỉ mới</div>
              <div><Plus size={20} color="#000000" weight="light" /></div>
            </div>
          </div>
        </div>


      </div>
      <div>
        <div className="px-3 pt-3 bg-[#fff] border-t border-t-solid border-t-[#efefef] fixed bottom-0 w-full">
          <div className="">
            <div className="flex w-full">
              <Button color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={handleAccept}> Xác nhận</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Address
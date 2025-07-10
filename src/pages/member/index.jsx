import React, { useState} from "react"
import { CaretRight, Clock, Phone, Crown, SealPercent } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom";
import Infomation from "./infomation"
import FollowOA from "../../components/follow-oa"
import ShareLink from "../../components/share-link";

const Member = () => {
  const navigate = useNavigate()
  const [type, setType] = useState('1')

  const handleChangeType = (value) => {
    setType(value)
  }

  const goTo = (path) => {
    navigate(path)
  }

  return (
    <div className="absolute top-[44px] h-[calc(100vh-100px)] overflow-y-auto w-full">
      <div className="bg-[#fff] m-2 p-3 rounded-lg">
        <Infomation />
      </div>

      <div className="bg-[#fff] m-2 p-3 rounded-lg">
        <div className="font-bold">Khác</div>
        {/* <div className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <div><UserCircle size={20} color="#141415" /></div>
            <div className="text-[12px] text-center pl-2">Thông tin tài khoản</div>
          </div>
          <div>
            <CaretRight size={18} color="#141415" />
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#eee]"></div> */}
        <div onClick={() => goTo('/history-order')} className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <div><Clock size={20} color="#141415" /></div>
            <div className="text-[12px] text-center pl-2">Lịch sử đơn hàng</div>
          </div>
          <div>
            <CaretRight size={18} color="#141415" />
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#eee]"></div>
        <div onClick={() => goTo('/coupon')} className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <div><SealPercent size={20} color="#141415" /></div>
            <div className="text-[12px] text-center pl-2">Ví Voucher</div>
          </div>
          <div>
            <CaretRight size={18} color="#141415" />
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#eee]"></div>
        <div onClick={() => goTo('/membership')} className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <div><Crown size={20} color="#141415" /></div>
            <div className="text-[12px] text-center pl-2">Hạng thành viên</div>
          </div>
          <div>
            <CaretRight size={18} color="#141415" />
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#eee]"></div>
      </div>
      <FollowOA />
      <ShareLink />
    </div>
  )
}

export default Member

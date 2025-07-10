import React from "react"
import { Phone } from "@phosphor-icons/react"
import { Avatar } from "antd"

const TcbFooter = () => {
  return (
    <div className="w-full p-4 bg-white">
      <div className="">
        <div className="">
          <div className="flex justify-center">
            <Avatar shape="square" size="29" src="https://content.pancake.vn/1/s500x500/fwebp0/ae/6e/db/48/71edee1981e5e75ac72d13bfdb1cdb65b8a13d1d25b2e533b4c2baea.png"/>
            <div className="text-xl ml-2 text-[#25282A] font-semibold flex items-center">Storecake</div>
          </div>
          <div className="h-[26px] text-base font-medium text-center">
            © 2024 Storecake.io
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-light">Hỗ trợ khách hàng</div>
          <div className="flex items-center justify-center">
            <Phone size={20} />
            <a className="ml-1 text-base font-medium whitespace-nowrap" href="tel:1900888619">1900 888 619 </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TcbFooter
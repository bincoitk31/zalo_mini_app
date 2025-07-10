import React from "react"
import { Avatar } from "antd"

const TcbHeader = () => {
  return (
    <div className="w-full px-4 sticky top-0 bg-white" style={{ 'box-shadow': '0 2px 8px 2px rgba(0, 0, 0, .08)' }}>
    <div className="h-[60px] max-w-[1024px] m-auto flex items-center justify-between">
      <div className="flex">
        <div>
          <Avatar shape="square" size="29" src="https://content.pancake.vn/1/s500x500/fwebp0/ae/6e/db/48/71edee1981e5e75ac72d13bfdb1cdb65b8a13d1d25b2e533b4c2baea.png"/>
        </div>
        <div className="text-xl ml-2 text-[#25282A] font-semibold">Storecake</div>
      </div>

    </div>
  </div>
  )
}

export default TcbHeader
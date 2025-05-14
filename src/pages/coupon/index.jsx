import React, { useEffect, useState} from "react";
import { Button } from "antd";
import { couponStore } from "../../recoil/coupon";
import { formatNumber } from "../../utils/formatNumber";

const Coupon = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [coupons, setCoupons] = useState([])
  const [couponUsed, setCouponUsed] = useState([])

  const items = [
    {
      key: 1,
      label: "Tất cả"
    },
    {
      key: 2,
      label: "Đã sử dụng"
    }
  ]

  const onChangeTab = (key) => {
    setActiveKey(key)
  }

  const formatTime = (time) => {
    const date = new Date(time); // Use UTC time
    date.setHours(date.getHours() + 7); // Add 7 hours

    return date.toLocaleDateString("en-GB");
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert("Đã sao chép!");
    });
  };

  useEffect(() => {
    couponStore('getCoupons')
    .then(res => {
      let coupons = res.data.coupons.filter(c => !c.is_used)
      setCoupons(coupons)
    })
  }, [])

  return (
    <div className="absolute top-[44px] h-[calc(100vh-36px)] overflow-y-auto w-full ">
      <div className="flex tabs-custom-default bg-[#fff]">
        <div className={`w-1/2 text-center py-2 ${activeKey == 1 ? 'active' : '' }`} onClick={() => onChangeTab(1)}>
          Tất cả
        </div>
        <div className={`w-1/2 text-center py-2 ${activeKey == 2 ? 'active' : '' }`} onClick={() => onChangeTab(2)} >
          Đã sử dụng
        </div>
      </div>

      {
        activeKey == 1
        ?
          <div>
            {
              coupons.map(c => (
                <div className="bg-[#fff] m-2 p-2 flex justify-between items-center rounded-md">
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className="font-medium">
                      {
                        c.promo_code_info?.is_percent
                        ? "Giảm " + (c.promo_code_info?.discount || 0) + "% Tối đa " + formatNumber(c.promo_code_info?.max_discount_by_percent)
                        : "Giảm " + formatNumber(c.promo_code_info?.discount || 0)
                      }

                    </div>
                    { c.promo_code_info?.order_price_min &&
                        <div className="text-[12px]"> Đơn tối thiểu {formatNumber(c.start_price)} </div>
                    }
                    {
                      c.promo_code_info?.order_price_max &&
                        <div className="text-[12px]"> Đơn tối đa {formatNumber(c.end_price)} </div>
                    }
                    {
                      (c.start_time && c.end_time) &&
                      <div className="text-[10px] text-[#666]">
                        HSD: {"Từ " + formatTime(c.start_time) + " đến " + formatTime(c.end_time)}
                      </div>
                    }
                  </div>
                  <Button onClick={() => {copyToClipboard(c.name)}} className="font-medium" variant="solid" color="default">Sao chép</Button>
                </div>
              ))
            }

          </div>
        :
          <div>
            <div>
            </div>
          </div>
      }

    </div>
  )
}

export default Coupon
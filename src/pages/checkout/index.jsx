import React, { useEffect, useState, useRef } from "react"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import {
  customerInfoState,
  cartItemsState,
  totalPriceState,
  amountPriceState,
  discountCouponState,
  listAddressState,
  openAddAddressState,
  orderStore,
  shippingFeeState
} from "../../recoil/order"
import { Button, Input, message, Select, Space, ConfigProvider } from "antd"
import { postApi, postApiAxios } from "../../utils/request"
import { formatNumber } from "../../utils/formatNumber"
import { useNavigate } from "react-router-dom"
import { validatePhoneNumber, isValidEmail } from "../../utils/tools"
import { activeTabState } from "../../recoil/atoms"
import { customerState } from "../../recoil/member"
import { AirplaneTilt, Package, User, MapPinLine, Plus } from '@phosphor-icons/react'
import { Payment, events, EventName } from "zmp-sdk/apis"
import { couponStore } from "../../recoil/coupon"

import CartItems from "../../components/cart-items"
import Bill from "../../components/bill"
import PaymentMethod from "../../components/payment-method"
import CryptoJS from "crypto-js";
import { getDataToStorage, setDataToStorage } from "../../utils/tools"

const Checkout = () => {
  const setActiveTab = useSetRecoilState(activeTabState)
  const totalPrice = useRecoilValue(totalPriceState)
  const couponRef = useRef(null)
  const [shippingFee, setShippingFee] = useRecoilState(shippingFeeState)
  const setOpenAddAddress = useSetRecoilState(openAddAddressState)
  const [customer, setCustomer] = useRecoilState(customerState)
  const navigate = useNavigate()
  const country_id = 84
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)
  const [listAddress, setListAddress] = useRecoilState(listAddressState)
  const [discountCoupon, setDiscountCoupon] = useRecoilState(discountCouponState)
  const [amountPrice, setAmountPrice] = useRecoilState(amountPriceState)
  const [customerInfo, setCustomerInfo] = useState({})
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [provinces, setProvinces] = useState({})
  const [districts, setDistricts] = useState({})
  const [communes, setCommunes] = useState({})
  const [provinceId, setProvinceId] = useState()
  const [districtId, setDistrictId] = useState()
  const [note, setNote] = useState()
  const [couponName, setCouponName] = useState()

  const renderProvince = () => {
    if(!window.WebAddress[country_id]) return
    const provinces = window.WebAddress[country_id] || {}
    let options = Object.keys(provinces).sort((a, b) => provinces[a].name.localeCompare(provinces[b].name))
    if (country_id == 84) {
      const idxHCM = options.findIndex(el => el == '701')
      options.splice(idxHCM, 1)
      options.unshift('701')

      const idxHN = options.findIndex(el => el == '101')
      options.splice(idxHN, 1)
      options.unshift('101')
    }

    setProvinces(options.map(el => ({value: el, label: <span>{provinces[el].name}</span>})))
  }

  const renderDistricts = () => {
    if (!provinceId) return
    const districts = window.WebAddress[country_id][provinceId] || {}
    let options = Object.keys(districts).filter(el => !['id', 'name', 'name_en'].includes(el))
    options.sort((a, b) => districts[a].name.localeCompare(districts[b].name))

    setDistricts(options.map(el => ({value: el, label: <span>{districts[el].name}</span>})))
  }

  const renderCommunes = () => {
    if (!districtId && !provinceId) return
    const communes = window.WebAddress[country_id][provinceId][districtId] || {}
    let options = Object.keys(communes).filter(el => !['id', 'name', 'name_en'].includes(el))
    options.sort((a, b) => communes[a].name.localeCompare(communes[b].name))
    setCommunes(options.map(el => ({value: el, label: <span>{communes[el].name}</span>})))
  }

  const setOrderItems = () => {
    const orders = cartItems.map(item => {
      const variation_info = {
        id: item.id,
        custom_id: item.custom_id,
        product_custom_id: item.product_custom_id,
        display_id: item.display_id,
        variation_pos_id: item.variation_pos_id,
        original_price: item.original_price,
        retail_price: item.retail_price,
        weight: item.weight,
        name: item.name,
        images: item.images,
        fields: item.fields,
        product_id: item.product_id,
        retail_price_after_discount: item.wholesale_price_active || item.retail_price,
        original_price_after_discount: item.original_price,
        product_pos_id: item?.product_pos_id,
        images_custom: item.images_custom,
        is_design: item.is_design,
        discount_retail_price_web: item.discount_retail_price_web,
        discount_once: item.discount_once,
        discount_once_web: item.discount_once_web
      }

      return {
        variation_id: item.id,
        quantity: item.quantity,
        variation_info,
        category_ids: (item.categories || []).map(c => c.id)
      }
    })

    return orders
  }

  const setItemsZalo = () => {
    const items = cartItems.map(item => {
      return {
        id: item.id,
        amount: item.retail_price
      }
    })
    return items
  }

  const updateOrderZalo = async (zalo_order_id) => {
    const url = `https://payment-mini.zalo.me/api/transaction/${import.meta.env.VITE_APP_ID}/cod-callback-payment`
    const privateKey = import.meta.env.VITE_ZALO_PRIVATE_KEY
    const appId = import.meta.env.VITE_APP_ID
    const orderId = zalo_order_id
    const resultCode = -1
    const dataMac = `appId=${appId}&orderId=${orderId}&resultCode=${resultCode}&privateKey=${privateKey}`
    const mac = CryptoJS.HmacSHA256(dataMac, privateKey).toString()

    let data = {
      appId,
      orderId,
      resultCode,
      mac
    }

    const res = await postApiAxios(url, data)
  }

  const handleOrder = () => {
    if (!customerInfo ?.full_name) return message.error("Tên không được để trống!")
    if (!customerInfo ?.phone_number) return message.error("Số điện thoại không được để trống!")
    if (!validatePhoneNumber(customerInfo ?.phone_number)) return message.error("Số điện thoại không hợp lệ!")
    if (customerInfo ?.email && !isValidEmail(customerInfo ?.email)) return message.error("Email hợp lệ!")
    if (!customerInfo ?.province_id || !customerInfo ?.district_id || !customerInfo ?.commune_id) return message.error("Địa chỉ không được để trống!")

    createOrderZalo()
  }

  const createOrder = async (zalo_order_id) => {

    // check duplicate order
    const lock_zalo_order_id = getDataToStorage('lock_zalo_order_id')
    if (lock_zalo_order_id == zalo_order_id) return
    setDataToStorage('lock_zalo_order_id', zalo_order_id)

    let customer_info = getDataToStorage('customer-info')
    if (!customer_info) {
      const list_address = JSON.parse(localStorage.getItem('list-address') || '[]')
      if (list_address.length == 0) return message.error("Vui lòng thêm địa chỉ nhận hàng")
      customer_info = list_address.find(el => el.default) || list_address[0]
    }

    let data = {
      order_items: setOrderItems(),
      shipping_address: {...customer_info, note: note},
      zalo_order_id: zalo_order_id,
      location: `https://zalo.me/s/${import.meta.env.VITE_APP_ID}/`,
      customer: customer,
      shipping_fee: shippingFee,
      form_data: {
        coupon: {
          value: couponRef.current
        },
        phone_number: {
          value: customer_info?.phone_number
        }
      }
    }

    const res = await postApi("/orders/quick_order", data)

    if (res.status == 200) {
      afterSubmitSuccess()
    } else {
      updateOrderZalo(zalo_order_id)
      const result = res.response.data.reason

      if(res.response.status == 500) {
        message.error("Lỗi hệ thống không xác định")
      }
      else if(typeof result === 'object' && result[0]) {
        const { message_code } = result[0]
        if(message_code == 2003) {
          message.error("Lỗi đặt sản phẩm đang hết hàng!")
        }
        if(message_code == 'variation_000') {
          message.error("Lỗi đặt sản phẩm không tồn tại")
        }
      }
      else if (result?.message_code == 2007) {
        message.error("Sản phẩm tặng kèm đang hết hàng")
      }
      else if(result?.message_code == 'forbidden_001') {
        message.error("Số điện thoại đã bị chặn")
      }
      else if(result?.code == 281) {
        message.error(result.message)
      }
      else if(result?.message_code == 1001) {
        message.error("Số điện thoại và địa chỉ đặt hàng không hợp lệ!")
      }
      else if(result?.message_code == 415) {
        message.error(result.message)
      }
      else {
        message.error(res.response.data.reason)
      }
    }
    

  }

  const createOrderZalo = () => {
    setLoadingOrder(true)
    const params = {
      amount: amountPrice,
      desc: `Thanh toán ${amountPrice}`,
      item: setItemsZalo(),
      // extradata:{
      //   myTransactionId: id
      // },
      method: {
        id: "COD",
        isCustom: false,
      }
    }
  
    const privateKey = import.meta.env.VITE_ZALO_PRIVATE_KEY

    const dataMac = Object.keys(params)
      .sort() // sắp xếp key của Object data theo thứ tự từ điển tăng dần
      .map(
        (key) =>
          `${key}=${
            typeof params[key] === "object"
              ? JSON.stringify(params[key])
              : params[key]
          }`,
      ) // trả về mảng dữ liệu dạng [{key=value}, ...]
      .join("&"); // chuyển về dạng string kèm theo "&", ví dụ: amount={amount}&desc={desc}&extradata={extradata}&item={item}&method={method}

      // Tạo overall mac từ dữ liệu

      let mac = CryptoJS.HmacSHA256(dataMac, privateKey).toString()

      Payment.createOrder({
        desc: `Thanh toán ${amountPrice}`,
        item: setItemsZalo(),
        amount: amountPrice,
        // extradata: JSON.stringify({
        //   myTransactionId: id // transaction id riêng của hệ thống của bạn
        // }),
        method: JSON.stringify({
          id: "COD", // Phương thức thanh toán
          isCustom: false, // false: Phương thức thanh toán của Platform, true: Phương thức thanh toán riêng của đối tác
        }),
        mac: mac,
        success: (data) => {
          // Tạo đơn hàng thành công
          // Hệ thống tự động chuyển sang trang thanh toán.
          const { orderId } = data;
          //createOrder(orderId)
        },
        fail: (err) => {
          // Tạo đơn hàng lỗi
          setLoadingOrder(false)
          console.log(err);
         
        },
      });

    }

  const afterSubmitSuccess = () => {
    setCartItems([])
    localStorage.removeItem('cartItems')
    navigate("/")
    setLoadingOrder(false)
    message.success("Đặt hàng thành công")
  }

  const goTo = (path) => {
    navigate(path)
  }

  const findCoupon = () => {
    let params = {
      name: couponName,
      total_price: totalPrice,
      phone_number: customerInfo?.phone_number
    }

    couponStore('findCouponByName', params)
    .then(res => {
      if (res.status == 200) {
        if (res.data.data.message) {
          let reason = res.data.data.reason
          setDiscountCoupon(0)
          couponRef.current = null
          switch(res.data.data.message) {
            case "coupon_000":
              message.error("Mã khuyến mãi không tồn tại")
              break
            case "coupon_001":
              message.error("Mã khuyến mãi đã được sử dụng")
              break
            case "coupon_002":
              message.error("Mã khuyến mãi không hợp lệ")
              break
            case "coupon_003":
              message.error("Mã khuyến mãi hết hạn sử dụng")
              break
            case "coupon_004":
              const [, min] = reason.split('Minimum order value ')
              message.error(`Giá trị đơn này tối thiểu ${formatNumber(min)}`)
              break
            case "coupon_005":
              const [, max] = reason.split('Maximum order value ')
              message.error(`Giá trị đơn này tối đa ${formatNumber(max)}`)
              break
            case "coupon_006":
              message.error("Khách hàng vượt quá số lần sử dụng")
              break
            case "coupon_007":
              message.error("Chỉ áp dụng với khách hàng mới")
              break
            case "coupon_008":
              message.error("Vui lòng điền đủ thông tin để nhận khuyến mãi")
              break
          }
        } else {
          calcDiscountCoupon(res.data.data)
          message.success("Áp dụng voucher thành công")
        }
      }
    })
  }

  const calcDiscountCoupon = (coupon) => {
    const { discount = 0, is_percent, max_discount_by_percent = 0 } = coupon?.promo_code_info || {}
    let value = is_percent ? max_discount_by_percent < Math.floor(totalPrice * discount / 100) && max_discount_by_percent != 0 ? max_discount_by_percent : Math.floor(totalPrice * discount / 100) : discount
    if (coupon?.is_free_shipping) {
      setShippingFee(0)
    }
    setDiscountCoupon(value)
    couponRef.current = coupon // Store the latest coupon value
  }

  useEffect(() => {
    renderProvince()
  }, [window.WebAddress])

  useEffect(() => {
    renderDistricts()
  },[provinceId])

  useEffect(() => {
    renderCommunes()
  }, [districtId])

  useEffect(() => {
    const customer_info = getDataToStorage('customer-info')
    setCustomerInfo(customer_info)
  }, [])

  useEffect(() => {
    const list_address = JSON.parse(localStorage.getItem('list-address') || '[]')
    let address = list_address.find(el => el.default)
    if (address) return setCustomerInfo(address)
    if (!address && list_address.length > 0) return setCustomerInfo(list_address[0])
    if (list_address.length == 0) return setCustomerInfo(null)
  }, [listAddress])

  useEffect(() => {
    const params = {
      country: 84,
      province: customerInfo ?.province_id,
      districts: customerInfo ?.district_id,
      communes: customerInfo ?.commune_id,
      total_price: cartItems.reduce((acc, item) => acc + parseInt(item.retail_price) * parseInt(item.quantity), 0),
      quantity: cartItems.reduce((acc, item) => acc + parseInt(item.quantity), 0),
      weight: cartItems.reduce((acc, item) => acc + parseInt(item.weight) * parseInt(item.quantity), 0),
      site_id: import.meta.env.VITE_SITE_ID,
      payment_method: 'cod',
      shipping_fee_id: null,
      category_ids: cartItems.map(item => item.categories ? item.categories.map(c => c.id) : []).flat()
    }
    orderStore('getShippingFee', params)
    .then(res => {
      if (res.status == 200) {
        setShippingFee(res.data.price_ship ?.value || 0)
      }
    })

  }, [customerInfo, cartItems])

  // useEffect(() => {
  //   orderStore('getPriceShipOrders', {country_id: 84})
  //   .then(res => {
  //     if (res.status == 200) {
  //       console.log(res, "getPriceShipOrders")
  //     }
  //   })
  // }, [])

  useEffect(() => {
    const params = {
      ids: cartItems.map(item => item.product_id)
    }
    orderStore('getProductByIds', params)
    .then(res => {
      if (res.status == 200) {
        let variations_all = []
        res.data.data.map(el =>{
          let variations = el.variations.map(v => {
            return {
              ...v,
              categories: el.categories,
              name: el.name,
              product_custom_id: el.custom_id
            }
          })
          variations_all.push(...variations)
        })
        setCartItems(prev => prev.map(item => {
          const variation = variations_all.find(v => v.id == item.variation_id)
          return {...item, ...variation}
        }))
      }
    })
  }, [])

  useEffect(() => {
    const amount = totalPrice - discountCoupon + shippingFee
    setAmountPrice(amount)
  }, [discountCoupon, shippingFee, totalPrice])

  useEffect(() => {
    events.on(EventName.OpenApp, (data) => {
      const path = data?.path;
      // kiểm tra path trả về từ giao dịch thanh toán
      // RedirectPath: đã cung cấp tại trang khai báo phương thức

      if (path.includes(RedirectPath)) {
        // Nếu đúng với RedirectPath đã cũng cấp, thực hiện redirect tới path được nhận
        // Kiểm tra giao dịch bằng API checkTransaction nếu muốn
        Payment.checkTransaction({
          data: path,
          success: (rs) => {
            // Kết quả giao dịch khi gọi api thành công
            const { orderId, resultCode, msg, transTime, createdAt } = rs;
            //createOrder(orderId)
          },
          fail: (err) => {
            // Kết quả giao dịch khi gọi api thất bại
            console.log(err);
          },
        });
      }
    });

    events.on(EventName.PaymentClose, (data) => {
      const resultCode = data?.resultCode;

      if (data?.orderId) {
        createOrder(data.orderId)
      } else {
        message.error("Lỗi đặt hàng")
      }
      // kiểm tra resultCode trả về từ sự kiện PaymentClose
      // 0: Đang xử lý
      // 1: Thành công
      // -1: Thất bại
    
      //Nếu trạng thái đang thực hiện, kiểm tra giao dịch bằng API checkTransaction nếu muốn
      if (resultCode === 0) {
        Payment.checkTransaction({
          data: { zmpOrderId: data?.zmpOrderId },
          success: (rs) => {
            // Kết quả giao dịch khi gọi api thành công
            const { orderId, resultCode, msg, transTime, createdAt } = rs;
          },
          fail: (err) => {
            // Kết quả giao dịch khi gọi api thất bại
            console.log(err);
          },
        });
      } else {
        // Xử lý kết quả thanh toán thành công hoặc thất bại
        const { orderId, resultCode, msg, transTime, createdAt } = data;
      }
    });
  }, []) // Empty dependency array since we're using ref

  return (
    <>
    <div className="absolute top-[44px] bg-[#fff] h-[calc(100vh-133px)] overflow-y-auto w-full">
      <div className="p-3 border-b border-b-solid border-b-[#dcdcdc]">
        <div className="font-bold pb-3">Hình thức giao hàng</div>
        <div className="flex justify-between">
          <Button className="h-[42px] w-1/2 mr-2 border border-solid border-[#000]">
            <div><AirplaneTilt size={24} color="#292929" weight="duotone" /></div>
            <div>Giao tận nơi</div>
          </Button>
          <Button className="h-[42px] w-1/2 ml-2" disabled={true}>
            <div><Package size={24} color="#292929" weight="duotone" /></div>
            <div>Tự đến lấy</div>
          </Button>
        </div>
      </div>

      <div className="p-3 border-b-[8px] border-b-solid border-b-[#efefef]">
        { customerInfo
        ?
        <div>
          <div className="flex justify-between">
            <div className="font-bold">Thông tin người nhận hàng</div>
            <div className="text-[12px]" onClick={() => goTo('/address')}>Thay đổi</div>
          </div>
          <div>
            <div className="flex pt-2">
              <User size={18} color="#cccccc" weight="fill" />
              <div className="flex pl-2">
                <div className="font-bold">{customerInfo.full_name}</div>
                <div className="px-2"> | </div>
                <div>{customerInfo.phone_number}</div>
              </div>
            </div>
            <div className="flex pt-2">
              <MapPinLine size={18} color="#cccccc" weight="fill" />
              <div className="pl-2">
                {customerInfo.decode_address}
              </div>
            </div>
          </div>
        </div>
        :
        <div onClick={() => setOpenAddAddress(true)} className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center bg-[#f3f3f3] rounded-full w-[42px] h-[42px]"><Package size={24} color="#ccc" weight="light"  /></div>
          <div className="flex items-center pt-2">
            <div className="pr-2">
              <Plus size={18} color="#000" weight="light" />
            </div>
            <div>Thêm địa chỉ nhận hàng</div>
          </div>
        </div>
        }
      </div>

      <div className="p-3 border-b border-b-solid border-b-[#dcdcdc]">
        <div className="font-bold">Sản phẩm đã chọn ({cartItems.length || 0})</div>
        <CartItems />
      </div>
      <div className="p-3 border-b border-b-solid border-b-[#dcdcdc]">
        <div className="flex justify-between items-center">
          <div className="font-bold">Ghi chú</div>
          <div>...</div>
        </div>
      </div>
      <div className="p-3 border-b border-b-solid border-b-[#dcdcdc]">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold">Chọn mã giảm giá</div>
          <div className="text-[12px]" onClick={() => goTo("/coupon")}>Xem tất cả</div>
        </div>
        <div className=" flex justify-center items-center">
        <ConfigProvider
           theme={{
            components: {
              Input: {
                activeBorderColor: '#d9d9d9',
                hoverBorderColor: '#d9d9d9',
                activeShadow: '#d9d9d9'
              }
            }
           }}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="Nhập mã khuyến mãi" value={couponName} onChange={e => setCouponName(e.target.value)} />
            <Button className="font-medium" color="default" variant="solid" onClick={() => findCoupon()}>Áp dụng</Button>
          </Space.Compact>
        </ConfigProvider>
        </div>
      </div>
      <PaymentMethod />

      <div>
        <Bill />
      </div>

    </div>
    <div>
      <div className="px-3 pt-3 bg-[#fff] border-t border-t-solid border-t-[#efefef] fixed bottom-0 w-full">
        <div className="">
          <div className="flex justify-between pb-3">
            <div className="font-bold">Tổng thanh toán:</div>
            <div className="font-bold">{formatNumber(amountPrice)}</div>
          </div>
          <div className="flex w-full">
            <Button disabled={cartItems.length == 0 ? true : false} color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => handleOrder()}> Đặt hàng</Button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Checkout
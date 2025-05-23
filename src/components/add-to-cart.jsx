import React, { useState} from "react"
import { Drawer, Button, message } from 'antd'
import { drawerAddCartState, productState, typeAddCartState } from "../recoil/product"
import { useRecoilState, useRecoilValue } from "recoil"
import { addCartState } from "../recoil/selectors"
import { formatNumber } from "../utils/formatNumber"
import { X } from '@phosphor-icons/react'
import { useNavigate } from "react-router-dom"
import QuantityProduct from "./quantity-product"
import { resizeLink } from "../utils/tools"

const AddToCart = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const [drawerAddCart, setDrawerAddCart] = useRecoilState(drawerAddCartState)
  const typeAddCart = useRecoilValue(typeAddCartState)
  const product = useRecoilValue(productState)
  const [attributeSelected, setAttributeSelected] = useState([])
  const [cartItems, setCartItems] = useRecoilState(addCartState)
  const [quantity, setQuantity] = useState(1)
  let result = []

  const onClose = () => {
    setDrawerAddCart(false)
  }

  const getRetailPrice = () => {
    let variations = product ?.variations || []
    let arrayPrice = variations.map(el => el.retail_price)
    let min = Math.min(...arrayPrice) || 0
    let max = Math.max(...arrayPrice) || 0

    let result = (min == max || arrayPrice.length == 0)  ? formatNumber(max) : `${formatNumber(min)} - ${formatNumber(max)}`

    return result
  }

  const handleSelectAttribute = (name, value) => {
    let idx = attributeSelected.findIndex(el => el.name == name)

    const updatedAttributes = idx > -1
      ? attributeSelected.map((el, index) =>
          index === idx ? { ...el, value } : el
        )
      : [...attributeSelected, { name, value }];

    setAttributeSelected(updatedAttributes);
  }

  const renderFields = () => {
    product.variations.forEach((variation) => {
      variation.fields.forEach((field) => {
        // Tìm nếu field đã tồn tại trong kết quả
        let existing = result.find((item) => item.name === field.name);
        if (existing) {
          // Nếu tồn tại, thêm giá trị nếu chưa có
          if (!existing.values.includes(field.value)) {
            existing.values.push(field.value);
          }
        } else {
          // Nếu chưa tồn tại, thêm field vào kết quả
          result.push({ name: field.name, values: [field.value] });
        }
      });
    });

    // // Sắp xếp giá trị để tránh sự khác biệt thứ tự
    // result.forEach((item) => item.values.sort());

    const checkActive = (name, value) => {
      if (attributeSelected.find(el => el.name == name && el.value == value)) return 'bg-[#000000] text-[#fff]'
      return ''
    }

    return (
      <>
      {
        result.map((el, idx) => (
          <div key={idx} className="pb-2">
            <div className="text-[#757575] text-[12px] pb-1">{el.name}</div>
            <div className="flex">
              {
                el.values.map(v => (
                  <div
                    key={v}
                    onClick={() => handleSelectAttribute(el.name, v)}
                    className={`${checkActive(el.name, v)} mr-2 flex items-center justify-center h-[30px] min-w-[30px] border border-solid border-[#d9d9d9] rounded-sm px-2`}
                  >
                    {v}
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
      </>
    )
  }
  
  const findVariation = () => {
    const areFieldsEqual = (fields1, fields2) => {
      if (fields1.length !== fields2.length) return false;
      return fields1.every(field1 =>
        fields2.some(field2 => field1.name === field2.name && field1.value === field2.value)
      )
    }

    const matchingVariations = product.variations.filter(variation => areFieldsEqual(variation.fields, attributeSelected));
    if (matchingVariations.length > 0) return matchingVariations[0]
    return {}
  }

  const handleChangeQuantity = (value) => {
    setQuantity(value);
  }


  const buyNow = () => {
    addToCart('buy-now')
  }

  const addToCart = (flag = 'add-cart') => {
    let variation = findVariation()
    if (!variation.id) return message.error({content: "Vui lòng chọn thuộc tính sản phẩm", style: {marginTop: '20px'}})
    variation = {...variation,
      quantity: parseInt(quantity),
      name: product.name,
      product_custom_id: product.custom_id,
      categories: product.categories
    }
    setCartItems(variation)
    message.success({
      content :'Đã thêm vào giỏ hàng',
      style: {
        marginTop: '20px'
      },
      duration: 3
    })
    onClose()
    if (flag == 'buy-now') navigate('/checkout')
  }

  const acceptAddCart = () => {
    typeAddCart == 'buy-now' ? buyNow() : addToCart()
  }

  return (
    <div>
      <Drawer
        placement={'bottom'}
        closable={false}
        onClose={onClose}
        open={drawerAddCart}
        className="custom-drawer"
        height={'auto'}
      >
       <div>
          <div className="flex p-3 border-b border-b-solid border-b-[#dcdcdc]">
            <div className="w-[56px] h-[56px]">
              <img className="w-full h-full object-cover rounded-lg" src={resizeLink(product ?.variations[0] ?.images[0] || '')} />
            </div>
            <div className="flex-1 pl-2">
              <div className="font-medium">{product.name}</div>
              <div className="font-bold">{getRetailPrice()}</div>
            </div>
            <div onClick={onClose}>
              <X size={20} color="#292929" weight="light" />
            </div>
          </div>
          <div className="p-3">
            {renderFields()}
          </div>
          <div className="flex justify-between items-center p-3">
            <div className="text-[#757575] text-[12px]">Số lượng:</div>
            <QuantityProduct quantity={quantity} changeQuantity={handleChangeQuantity} />
          </div>
          {
            !typeAddCart ?
              <div className="flex p-3">
                <div className="w-1/2 pr-1">
                  <Button color="default" variant="outlined" className="my-2 w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => addToCart()}> Thêm vào giỏ hàng</Button>
                </div>
                <div className="w-1/2 pl-1">
                  <Button color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => buyNow()}> Mua ngay</Button>
                </div>
              </div>
            :
              <div>
                <div className="w-full px-2">
                  <Button color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => acceptAddCart()}> Xác nhận</Button>
                </div>
              </div>
          }
         
       </div>
      </Drawer>
    </div>
  )
}

export default AddToCart
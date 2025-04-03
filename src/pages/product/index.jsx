import React, { useState, useEffect, useRef } from "react"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { productState, drawerAddCartState, typeAddCartState } from "../../recoil/product"
import { addCartState } from "../../recoil/selectors"
import { Button, message } from "antd"
import { formatNumber } from "../../utils/formatNumber"
import { useNavigate, useParams } from "react-router-dom"
import { activeTabState } from "../../recoil/atoms"
import {WechatLogo} from '@phosphor-icons/react'
import { openChat } from "zmp-sdk/apis"
import { getApi} from "../../utils/request"

import SliderProduct from "./slider-product"
import Description from "./description"

const Product = () => {
  const {id} = useParams()
  const setActiveTab = useSetRecoilState(activeTabState)
  const navigate = useNavigate()
  const [productView, setProductView] = useRecoilState(productState)
  const [attributeSelected, setAttributeSelected] = useState([])
  const [cartItems, setCartItems] = useRecoilState(addCartState)
  const [quantity, setQuantity] = useState(1)
  const [drawerAddCart, setDrawerAddCart] = useRecoilState(drawerAddCartState)
  const setTypeAddCartState = useSetRecoilState(typeAddCartState)

  const findVariation = () => {
    const areFieldsEqual = (fields1, fields2) => {
      if (fields1.length !== fields2.length) return false;
      return fields1.every(field1 =>
        fields2.some(field2 => field1.name === field2.name && field1.value === field2.value)
      )
    }

    const matchingVariations = productView.variations.filter(variation => areFieldsEqual(variation.fields, attributeSelected));
    if (matchingVariations.length > 0) return matchingVariations[0]
    return {}
  }

  const addTocart = () => {
    let variation = findVariation()

    if (!variation.id) return message.error("Vui lòng chọn thuộc tính sản phẩm")
    variation = {...variation,
      quantity: parseInt(quantity),
      name: productView.name,
      product_custom_id: productView.custom_id,
      categories: productView.categories
    }
    setCartItems(variation)
    message.success('Thêm vào giỏ hàng thành công', [2])
  }

  const getRetailPrice = () => {
    let variations = productView ?.variations || []
    let arrayPrice = variations.map(el => el.retail_price)
    let min = Math.min(...arrayPrice) || 0
    let max = Math.max(...arrayPrice) || 0

    let result = (min == max || arrayPrice.length == 0)  ? formatNumber(max) : `${formatNumber(min)} - ${formatNumber(max)}`

    return result
  }
  
  const getOriginalPrice = () => {
    let variations = productView.variations || []
    let arrayPrice = variations.map(el => el.original_price)
    let min = Math.min(...arrayPrice) || 0
    let max = Math.max(...arrayPrice) || 0

    let result = (min == max || arrayPrice.length == 0) ? formatNumber(max) : `${formatNumber(min)} - ${formatNumber(max)}`

    return result
  }

  const onOpenDrawerAddCart = (type) => {
    setDrawerAddCart(true)
    setTypeAddCartState(type)
  }

  const openChatScreen = async () => {
    try {
      let oa_id = import.meta.env.VITE_ZALO_OA_ID
      await openChat({
        type: "oa",
        id: oa_id,
        message: "Xin Chào",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  }

  

  useEffect(() => {
    console.log("attributeSelected updated:", attributeSelected);
  }, [attributeSelected]);

  useEffect(() => {
    setActiveTab('product')
  }, [])

  useEffect(() => {
    getApi(`/products/${id}`)
    .then(res => {
      if (res.status == 200) {
        const product = res.data.product
        setProductView(product)
        console.log(product, "producttttttt")
      }
    })
  }, [id])

  return (
    <>
      <div className="mt-[44px] overflow-y-auto bg-[#fff] h-[calc(100vh-89px)]" >
        <SliderProduct product={productView} images={ productView && productView ?.variations ? productView.variations[0].images : []} />

        <div className="px-2">
          <div className="mt-2 font-medium text-[18px]">{productView ?.name}</div>
          <div className="font-medium">{getRetailPrice()}</div>

          <Description product={productView ||{}}/>
        </div>
      </div>
      <div className="bg-[#fff] border-t border-t-solid border-t-[#fafafa] fixed bottom-0 w-full">
        <div className="flex px-3 items-center">
          <div className="mr-2" onClick={() => openChatScreen()}>
            <WechatLogo size={32} color="#292929" weight="light" />
          </div>
          <div className="flex w-full">
            <div className="w-1/2 pr-1">
              <Button color="default" variant="outlined" className="my-2 w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => onOpenDrawerAddCart('add-cart')}> Thêm vào giỏ hàng</Button>
            </div>
            <div className="w-1/2 pl-1">
              <Button color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => onOpenDrawerAddCart('buy-now')}> Mua ngay</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
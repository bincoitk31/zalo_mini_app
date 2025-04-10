import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { productState, drawerAddCartState, typeAddCartState } from "../recoil/product";
import { formatNumber } from "../utils/formatNumber";
import { PlusCircle } from "@phosphor-icons/react"
import LazyImageWithSkeleton from "./lazy-image";

const ProductItem = ({product}) => {
  const navigate = useNavigate()
  const setProductView = useSetRecoilState(productState)
  const setDrawerAddCart = useSetRecoilState(drawerAddCartState)
  const setTypeAddCartState = useSetRecoilState(typeAddCartState)

  const getRetailPrice = () => {
    let variations = product ?.variations || []
    let arrayPrice = variations.map(el => el.retail_price)
    let min = Math.min(...arrayPrice) || 0
    let max = Math.max(...arrayPrice) || 0

    let result = (min == max || arrayPrice.length == 0)  ? formatNumber(max) : `${formatNumber(min)} - ${formatNumber(max)}`

    return result
  }

  const getOriginalPrice = () => {
    let variations = product ?.variations || []
    let arrayPrice = variations.map(el => el.original_price)
    let min = Math.min(...arrayPrice) || 0
    let max = Math.max(...arrayPrice) || 0

    let result = (min == max || arrayPrice.length == 0) ? formatNumber(max) : `${formatNumber(min)} - ${formatNumber(max)}`

    return result
  }

  const goToProduct = (id) => {
    console.log(id, "iddd")
    navigate(`/product/${id}`);
    setProductView(product)
  }

  const onOpenDrawerAddCart = (e, prod) => {
    e.stopPropagation()
    console.log("product", prod)
    setProductView(prod)
    setTypeAddCartState('')
    setDrawerAddCart(true)

  }

  return (
    <div className="border border-solid border-[#eee] rounded-lg overflow-hidden" onClick={() => goToProduct(product.id)}>
      <div>
        <LazyImageWithSkeleton src={product?.variations?.[0]?.images?.[0]} className={"object-cover w-full h-[160px]"}/>
        {/* <img src={resizeLink(product?.variations?.[0]?.images?.[0] || "")} className="object-cover w-full h-[160px]" /> */}
      </div>
      <div className="px-2 pt-2 pb-4">
        <div className="font-medium text-truncate-2-line pb-1 h-11">{product.name}</div>
        <div className="flex justify-between items-center">
          <div>
            <div className="">
              <span className="font-bold"> {getRetailPrice()} </span>
            </div>
            {/* <div className="">
              <span className="line-through font-medium text-stone-800">{getOriginalPrice()}</span>
            </div> */}
          </div>
          <div>
            <PlusCircle onClick={e => onOpenDrawerAddCart(e, product)} size={20} color="#292829" weight="fill" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductItem
import React, { useEffect, useState } from "react"
import { useRecoilValue, useRecoilState } from "recoil";
import { cartItemsState, openCartState } from "../../recoil/order";
import { Button } from "antd"
import { Handbag, DotOutline } from "@phosphor-icons/react";
import { LoadingOutlined } from '@ant-design/icons'
import { categoryStore, termSearchState } from "../../recoil/category";
import ProductGrid from "../../components/product-grid";

const Search = () => {
  const [openCart, setOpenCart] = useRecoilState(openCartState)
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)
  const [term, setTerm] = useRecoilState(termSearchState)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState({data: []})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    categoryStore('searchProducts', {term, limit: 50})
    .then(res => {
      if (res.status == 200) {
        setProducts({data: res.data.result.products})
        setTotal(res.data.result.count)
      }
    })
    .finally(() => setLoading(false))
  }, [term])

  return (
    <>
    <div className="absolute top-[44px] bg-[#fff] h-[calc(100vh-89px)] overflow-y-auto w-full">
      <div className="px-4 pt-4">{total} kết quả tìm kiếm với từ khóa: '{term}'</div>
      <div>
        <div className="px-3">
          {
            loading
            ?
            <div className="flex flex-col items-center justify-center pt-4">
              <LoadingOutlined className="text-[20px]"/>
              <div className="pt-4">Đang tải...</div>
              </div>
            : <ProductGrid products={products} />
          }

        </div>
      </div>
    </div>
    <div>
      <div className="px-3  bg-[#fff] border-t border-t-solid border-t-[#efefef] fixed bottom-0 w-full">
        <div className="flex items-center">
          <div onClick={() => setOpenCart(true)} className="mr-2 flex items-center px-2 h-[36px] border-[2px] border-solid border-[#000] rounded-[4px]">
            <Handbag size={24} color="#000" weight="fill" />
            <span className="pl-1 font-bold">{cartItems.length || 0}</span>
          </div>

          <div className="w-full">
            <Button onClick={() => navigate('/checkout')} disabled={cartItems.length == 0 ? true : false} color="default" variant="solid" className="w-full h-[36px] my-2 rounded-[4px]"> 
              <div className="flex font-bold">
              <span>Thanh toán ngay</span>
              <span><DotOutline size={20} color="#fff" weight="fill" /></span>
              <span>{cartItems.length}</span>
              <span className="pl-1">sản phẩm</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Search
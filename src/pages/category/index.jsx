import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { categoriesState, categoryStore, categoryChooseState } from "../../recoil/category";
import { Handbag, DotOutline } from "@phosphor-icons/react";
import { Button } from "antd";
import { cartItemsState, totalPriceState, openCartState } from "../../recoil/order";
import { formatNumber } from "../../utils/formatNumber";
import { LoadingOutlined } from '@ant-design/icons'
import { resizeLink } from "../../utils/tools"
import CategoryItems from "../../components/category-items"

const Category = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const categories = useRecoilValue(categoriesState)
  const totalPrice = useRecoilValue(totalPriceState)
  const [openCart, setOpenCart] = useRecoilState(openCartState)
  const [categoryChoose, setCategoryChoose] = useRecoilState(categoryChooseState)

  const [products, setProducts] = useState({data: []})
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)
  const [loading, setLoading] = useState(false)


  const goToCategory = (id) => {
    // navigate(`/categories/${id}`)
    setCategoryChoose(id)
    setLoading(true)
    categoryStore('getCategoryById', {id})
    .then(res => {
      if (res.status == 200) setProducts(res.data.products)
    })
    .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (categories.length > 0) {
      let category_id = categories[0].id
      if (categoryChoose) {
        category_id = categoryChoose
      } else {
        setCategoryChoose(category_id)
      }

      setLoading(true)
      categoryStore('getCategoryById', {id: category_id})
      .then(res => {
        if (res.status == 200) setProducts(res.data.products)
      })
      .finally(() => setLoading(false))
    }
   console.log("vvvv")
  }, [])

  return (
    <>
      <div className="absolute top-[44px] bg-[#fff] h-[calc(100vh-89px)] overflow-y-auto w-full">
        <div className="flex overflow-x-auto bg-[#f3f3f3] pt-1">
          {
            categories.map(c => (
              <div
              onClick={() => goToCategory(c.id)}
              className={`flex flex-col m-2 items-center min-w-[62px] rounded-md ${categoryChoose == c.id ? 'bg-[#fff] border-b-[2px] border-b-solid border-b-[#000]' : 'bg-[#f3f3f3]'} `}
              key={c.id}
              >
                <div className="p-2 flex items-center justify-center w-[62px] h-[62px]">
                  <img className="w-full h-full object-cover rounded-md" src={resizeLink(c.image || "https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png")} />
                </div>
                <div className="text-zinc-500 text-truncate-2-line text-[12px] text-center">{c.name}</div>
              </div>
            ))
          }
        </div>
        
        <div className="px-3">
          {
            loading
            ?
            <div className="flex flex-col items-center justify-center pt-4">
              <LoadingOutlined className="text-[20px]"/>
              <div className="pt-4">Đang tải...</div>
              </div>
            : <CategoryItems products={products} />
          }
          
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

export default Category
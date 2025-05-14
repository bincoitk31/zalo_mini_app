import React, { useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { activeTabState } from "../../recoil/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { drawerAddCartState, typeAddCartState } from "../../recoil/product";
import { openCartState, openAddAddressState, cartItemsState } from "../../recoil/order";
import { memberZaloState } from "../../recoil/member";
import { Button, Badge } from 'antd'
import { HouseLine, ListMagnifyingGlass, ShoppingBag, User, ChatCircleDots } from '@phosphor-icons/react'
import { openChat, getUserID } from "zmp-sdk/apis";
import { getDataToStorage } from "../../utils/tools";
import AddToCart from "../add-to-cart";
import Cart from "../cart";
import AddAddress from "../add-address";

const FooterCustom = (props) => {
  const [activeTab, setActiveTab] = useRecoilState(activeTabState)
  const [drawerAddCart, setDrawerAddCart] = useRecoilState(drawerAddCartState)
  const [openCart, setOpenCart] = useRecoilState(openCartState)
  const [openAddAddress, setOpenAddAddress] = useRecoilState(openAddAddressState)
  const [memberZalo ,setMemberZalo] = useRecoilState(memberZaloState)
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)
  const [userId, setUserId] = useState()

  const location = useLocation()
  const { title } = props;
  const navigate = useNavigate()

  const goTo = (key) => {
    setActiveTab(key)
    switch (key) {
      case "home":
        navigate("/")
        break
      case "categories":
        navigate("/categories")
        break
      case "cart":
        setOpenCart(true)
        break
      case "member":
        navigate("/member")
        break
    }
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
    let cartItemsLocal = getDataToStorage("cart-items")
    setCartItems(cartItemsLocal)
  }, [])

  return (
    <>
      {
        (location.pathname == "/" || ["/member", "/contact", "/history-order"].includes(location.pathname) ) &&
        <div>
          <div className="bg-[#fff] border-t border-t-solid border-t-[#fafafa] fixed bottom-0 w-full">
            <div className="flex py-2 items-center">
              <div onClick={() => goTo("home")} className="flex-1 flex flex-col items-center">
                <HouseLine size={24} color={location.pathname == "/" ? '#292929' : '#797979'} weight="light" />
                <div className={location.pathname == "/" ? 'text-[#292929] text-[12px]' : 'text-[#797979] text-[12px]'}>Trang chủ</div>
              </div>
              <div onClick={() => goTo("categories")} className="flex-1 flex flex-col items-center">
                <ListMagnifyingGlass size={24} color="#797979" weight="light" />
                <div className="text-[12px] text-[#797979]">Danh mục</div>
              </div>
              <div onClick={() => goTo("cart")} className="flex-1 flex flex-col items-center">
                <Badge count={(cartItems|| []).length} size="small">
                  <ShoppingBag size={24} color="#797979" weight="light" />
                </Badge>
                <div className="text-[12px] text-[#797979]">Giỏ hàng</div>
              </div>
              <div onClick={() => openChatScreen()} className="flex-1 flex flex-col items-center">
                <ChatCircleDots size={24} color="#797979" weight="light" />
                <div className="text-[12px] text-[#797979]">Zalo chat</div>
              </div>
              <div onClick={() => goTo("member")} className="flex-1 flex flex-col items-center">
                <User size={24} color={location.pathname == '/member' ? '#292929' : '#797979'} weight="light" />
                <div className={location.pathname == "/member" ? 'text-[#292929] text-[12px]' : 'text-[#797979]  text-[12px]'}>Cá nhân</div>
              </div>
            </div>
          </div>
        </div>
      }
   
      {drawerAddCart && <AddToCart />}
      {openCart && <Cart />}
      {openAddAddress && <AddAddress />}
    </>
  )
}

export default FooterCustom
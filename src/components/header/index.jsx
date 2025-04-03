import React, { act, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { activeTabState } from "../../recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberZaloState } from "../../recoil/member";
import { CaretLeft, HouseLine, MagnifyingGlass } from '@phosphor-icons/react';
import { Input } from "antd";
import { termSearchState } from "../../recoil/category";

const HeaderCustom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useRecoilState(activeTabState)
  const [isVisible, setIsVisible] = useState(false)
  const memberZalo = useRecoilValue(memberZaloState)
  const [term, setTerm] = useRecoilState(termSearchState)

  const handleScroll = () => {
    const page = document.querySelector('.zaui-page')
    if (page.scrollTop > 75) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const goHome = () => {
    navigate('/')
  }

  const goBack = () => {
    navigate(-1)
  }

  const handleSearch = (e) => {
    console.log(e.target.value, "valuuuuuu")
    setTerm(e.target.value)
    navigate('/search')
  }

  const handleSearchBlog = (e) => {
    console.log(e.target.value)
  }

  useEffect(() => {
    console.log(location.pathname, "oo")
    const tabMapping = {
      "/": "home",
      "/categories": "categories",
      "/cart": "cart",
      "/member": "member",
      "/checkout": "checkout",
      "/address": "address",
      "/search": "search",
      "/history-order": "history-order",
      "/contact": "contact",
      "/blog": "blog",
      "/membership": "membership",
      "/coupon": "coupon"
    };
    setActiveTab(tabMapping[location.pathname] || "home");
  }, [location])

  useEffect(() => {
    const page = document.querySelector('.zaui-page')
    if (page) page.addEventListener("scroll", handleScroll)

    return () => {
      if (page) page.removeEventListener("scroll", handleScroll)
    };
  }, []);

  return (
    <>
      {
        activeTab == 'home' &&
        <div className="fixed w-full z-[999]" style={{ display: isVisible ? "block" : "none"}}>
          <div className="flex bg-[#000] p-2">
            <div>
              <img src={memberZalo.avatar} className="w-[36px] h-[36px] rounded-full"/>
            </div>
            <div className="pl-2 text-[#fff] text-[12px] flex items-center">
              <div className="font-bold">{memberZalo.name}</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'product' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Chi tiết sản phẩm</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'checkout' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Trang thanh toán</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'address' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Địa chỉ nhận hàng</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'categories' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <HouseLine onClick={goHome} size={20} color="#ffffff" weight="bold" />
              <div className="pl-3 w-[250px]">
                <Input
                  placeholder="Tìm kiếm sản phẩm"
                  size="small"
                  className="!bg-[#d9d9d9] rounded-full"
                  prefix={
                    <MagnifyingGlass size={16} color="#888" weight="light" />
                  }
                  onPressEnter={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'search' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <HouseLine onClick={goHome} size={20} color="#ffffff" weight="bold" />
              <div className="pl-3 w-[250px]">
                <Input
                  placeholder="Tìm kiếm sản phẩm"
                  size="small"
                  className="!bg-[#d9d9d9] rounded-full"
                  prefix={
                    <MagnifyingGlass size={16} color="#888" weight="light" />
                  }
                  onPressEnter={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'history-order' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Lịch sử đơn hàng</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'member' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Cá nhân</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'contact' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Liên hệ và góp ý</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'blog' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <HouseLine onClick={goHome} size={20} color="#ffffff" weight="bold" />
              <div className="pl-3 w-[250px]">
                <Input
                  placeholder="Tìm kiếm thông tin"
                  size="small"
                  className="!bg-[#d9d9d9] rounded-full"
                  prefix={
                    <MagnifyingGlass size={16} color="#888" weight="light" />
                  }
                  onPressEnter={handleSearchBlog}
                />
              </div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'article' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Bài viết</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'membership' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Hạng thành viên</div>
            </div>
          </div>
        </div>
      }

      {
        activeTab == 'coupon' &&
        <div className="fixed w-full z-[999]">
          <div className="flex bg-[#000] p-2 h-[44px]">
            <div className="text-[#fff] text-[14px] flex items-center">
              <CaretLeft onClick={goBack} size={20} color="#ffffff" weight="light" />
              <div className="font-bold">Ưu đãi của tôi</div>
            </div>
          </div>
        </div>
      }

    </>
  )
};

export default HeaderCustom;
import React, { Suspense, useEffect, useState } from "react";
import { Page } from "zmp-ui";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { carouselState } from "../recoil/atoms";
import { categoryStore, categoriesState, categoryChooseState, categoriesHomeState } from "../recoil/category";
import { useNavigate } from "react-router-dom";
import { memberZaloState, phoneMemberZaloState, customerState } from "../recoil/member";
import { getDataToStorage } from '../utils/tools';
import { blogStore, blogHomeState } from "../recoil/blog";

import Carousel from "../components/carousel";
import ListCategory from "../components/list-categoy";
import ProductList from "../components/product-list";
import FollowOA from "../components/follow-oa";
import Articles from "../components/articles";
import settings from "../../app-settings.json";

const HomePage = () => {
  const CATEGORIES_HOME = settings ?.categories_home || []
  const CATEGORY_BLOG = settings ?.category_blog

  const navigate = useNavigate()
  const carousel = useRecoilValue(carouselState)
  const [categories, setCategories] = useRecoilState(categoriesState)
  const [memberZalo ,setMemberZalo] = useRecoilState(memberZaloState)
  const [categoryChoose, setCategoryChoose] = useRecoilState(categoryChooseState)
  const setPhoneMemberZalo = useSetRecoilState(phoneMemberZaloState)
  const [categoriesHome, setCategoriesHome] = useRecoilState(categoriesHomeState)
  const [customer, setCustomer] = useRecoilState(customerState)
  const [blogHome, setBlogHome] = useRecoilState(blogHomeState)

  const renderProductsCategories = (category) => {

    return (
      <div className="mt-4" key={category.id}>
        <div className="flex justify-between font-bold pb-2">
          <span className="text-[14px]">{category.name}</span>
          <span onClick={() => goToCategory(category.id)}>Tất cả</span>
        </div>
        <ProductList products={category.products} />
      </div>
    )
  }

  const goToCategory = (id) => {
    setCategoryChoose(id)
    navigate('/categories')
  }

  const goTo = (path) => {
    navigate(path)
  }

  const fetchCategories = async () => {
    let updatedCategories = []

    for (const category_id of CATEGORIES_HOME) {
      try {
        const res = await categoryStore("getCategoryById", { id: category_id });

        if (res.status === 200) {
          if (res.data.result && res.data.result.products.data.length > 0) {
            updatedCategories.push({
              id: category_id,
              name: res.data.result.name,
              products: res.data.result.products
            });
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }
    setCategoriesHome(updatedCategories)
  }

  const getCategories = async () => {
    const res = await categoryStore('getCategories')
    if (res.status == 200) {
      setCategories(res.data.categories)
    }
  }

  const getCategoryBlog = async () => {
    const res = await blogStore('getArticles', { category_id: CATEGORY_BLOG, page: 1, limit: 10})
    if (res.status == 200) {
      setBlogHome(res.data.result)
    }
  }

  useEffect(() => {
    const customerStore = getDataToStorage('customerStore')
    if (customerStore) setCustomer(customerStore)
  }, [])

  useEffect(() => {
    if (categoriesHome.length === 0) fetchCategories()
    if (categories.length === 0) getCategories()
    if (!blogHome) getCategoryBlog()
  }, [])

  return (
    <Page className="page">
      <div className="flex h-[52px] bg-[#000] p-2">
        <div>
          <img src={customer.avatar || 'https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png'} className="w-[36px] h-[36px] rounded-full"/>
        </div>
        <div className="pl-2 text-[#fff] text-[12px]">
          <div>Xin chào,</div>
          <div className="font-bold">{customer.name || 'Quý khách'}</div>
        </div>
      </div>
      {/* <div className="relative h-[100px] bg-[#fff]">
        <div className="mx-2 bg-[#fff] rounded-lg absolute top-[-37px] w-[calc(100%-16px)] border border-solid border-[#f8f4f4]">
          <div className=" border-b border-b-solid border-b-[#f8f4f4]">
            <div className="p-2 flex justify-between">
              <div className="text-green-600">Member</div>
              <div className="flex items-center">
                <Star size={18} color="#fadb14" weight="fill" />
                <span className="pl-2">0</span>
                <CaretRight size={14} color="#292829" weight="thin" />
              </div>
            </div>
          </div>
          <div className="">
            
            <div className="flex justify-between p-2">
              <div className={`flex flex-col items-center w-[60px]}`} onClick={() => handleChangeType('1')} >
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec]`}>
                <ShoppingBag size={24} color="#212121" weight="duotone" />
                </div>
                <div className="text-[12px] text-center pt-1">Mua hàng</div>
              </div>
              <div className={`flex flex-col items-center w-[60px]`} onClick={() => handleChangeType('2')}>
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec] `}>
                  <Gift size={24} color="#212121" weight="duotone" />
                </div>
                <div className="text-[12px] text-center pt-1">Ưu đãi của tôi</div>
              </div>
              <div className={`flex flex-col items-center w-[60px]`} onClick={() => goTo('/history-order')}>
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec]`}>
                  <ShoppingCart size={24} color="#212121" weight="duotone"/>
                </div>
                <div className="text-[12px] text-center pt-1">Lịch sử đơn hàng</div>
              </div>
              <div className={`flex flex-col items-center w-[60px]`} onClick={() => handleChangeType('3')}>
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec]`}>
                  <Truck size={24} color="#212121" weight="duotone" />
                </div>
                <div className="text-[12px] text-center pt-1">Theo dõi đơn hàng</div>
              </div>
            </div>
            
          </div>
        </div>
      </div> */}
      

      <div className="p-2 mb-2 bg-[#fff]">
        <Carousel images={carousel}/>
      </div>

      <FollowOA />

      <Suspense>
        <div className="section-container">
          <ListCategory />
          { categoriesHome.map(el => renderProductsCategories(el)) }
          <Articles blog={blogHome}/>
        </div>
      </Suspense>
      <div className="mb-[50px]"></div>
    </Page>
  );
};

export default HomePage;

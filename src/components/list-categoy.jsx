import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil"
import { categoriesState, categoryChooseState } from "../recoil/category"

import { useNavigate, Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { activeTabState } from "../recoil/atoms";
import { resizeLink } from "../utils/tools"

const ListCategory = () => {
  const navigate = useNavigate()
  const categories = useRecoilValue(categoriesState)
  const setActiveTab = useSetRecoilState(activeTabState)
  const [categoryChoose, setCategoryChoose] = useRecoilState(categoryChooseState)
  console.log(categories, "cccc")

  const goToCategory = (id) => {
    //navigate(`/categories/${id}`)
    setCategoryChoose(id)
    navigate('/categories')
  }

  

  return (
    <div>
      <div className="flex justify-between">
        <div className="font-bold text-[14px]">Danh mục sản phẩm</div>
        <div className="flex items-center text-blue-500">
          <Link to="/categories" onClick={() => setCategoryChoose(null) }>
            <span className="pr-1">Xem thêm</span>
            <RightOutlined className="text-[12px]" />
          </Link>
        </div>
      </div>
      <div className="flex overflow-x-auto">
        {
          categories.map(c => (
            <div
            onClick={() => goToCategory(c.id)}
            className="p-2 m-2 bg-[#fff] w-[79px]"
            key={c.id}
            >
              <div className="flex items-center justify-center w-[50px]">
                <img className="w-[50px] h-[50px] rounded-full" src={ resizeLink(c.image || "https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png")} />
              </div>
              <div className="truncate text-center">{c.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ListCategory
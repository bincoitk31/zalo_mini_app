import React, { useEffect, useState } from "react"
import ProductGrid from "../../components/product-grid"
import { useParams } from "react-router-dom"
import { categoryStore, categoriesState  } from "../../recoil/category";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { activeTabState } from "../../recoil/atoms"

const CategoryItems = () => {
  const setActiveTab = useSetRecoilState(activeTabState)
  const {id} = useParams()
  const categories = useRecoilValue(categoriesState)
  const [products, setProducts] = useState({data: []})
  const [nameCategory, setNameCategory] = useState("")

  useEffect(() => {
    categoryStore('getCategoryById', {id})
      .then(res => {
        if (res.status == 200) setProducts(res.data.result.products)
        console.log(res, "productssssss")
      })
  }, [])

  useEffect(() => {
    let category = categories.find(el => el.id == id)
    if (category) return setNameCategory(category.name)
  }, [categories])

  useEffect(() => {
    setActiveTab('category-items')
  }, [])

  return (
    <div className="my-[50px] bg-[#fff] px-2">
      <div className="font-bold pt-4 pb-2 text-[18px]">{nameCategory}</div>
      <div className="overflow-y-auto h-[calc(100vh-130px)]">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}

export default CategoryItems
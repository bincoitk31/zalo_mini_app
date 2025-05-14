import React, { useEffect, useState, useRef, useCallback } from "react"
import ProductGrid from "../components/product-grid"
import { Package } from "@phosphor-icons/react";
import { useParams } from "react-router-dom"
import { categoryStore, categoriesState  } from "../recoil/category";
import { useRecoilState } from "recoil";
import { activeTabState } from "../recoil/atoms"
import { categoryChooseState } from "../recoil/category"

const CategoryItems = (props) => {
  const [categoryChoose, setCategoryChoose] = useRecoilState(categoryChooseState)
  const categoryRef = useRef(null)
  const [products, setProducts] = useState({data: props.products ?.data || [], page: 1, hasMore: true})
  const [loading, setLoading] = useState(false);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchMoreProducts = useCallback(async () => {
    if (loading || !products.hasMore) return
    setLoading(true)
    categoryStore('getCategoryById', {id: categoryChoose, page: products.page + 1})
      .then(res => {
        if (res.status == 200) {
          if (res.data.result.products.data.length > 0) {
            setProducts(prev => ({
              data: [...prev.data, ...res.data.result.products.data],
              page: prev.page + 1,
              hasMore: res.data.result.products.data.length > 0
            }))
          } else {
            setProducts(prev => ({...prev, hasMore: false}))
          }
        }
      })
      .finally(() => setLoading(false))
  }, [loading, products])

  const handleScroll = useCallback(
    debounce(() => {
      if (!categoryRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = categoryRef.current;

      // Nếu người dùng cuộn đến 90% chiều cao thì tải thêm dữ liệu
      if (scrollTop + clientHeight >= scrollHeight * 0.95 && !loading) {
        fetchMoreProducts();
      }
    }, 200), [fetchMoreProducts]
  )

  useEffect(() => {
    const cate = categoryRef.current
    if (cate) {
      cate.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (cate) {
        cate.removeEventListener("scroll", handleScroll)
      }
    };
  }, [products])

  return (
    <div>
      <div ref={categoryRef} className="overflow-y-auto h-[calc(100vh-213px)]">
        {
          products.data.length > 0
          ? 
            <div>
              <ProductGrid products={products} />
              {loading && <div className="text-center py-4">Đang tải thêm sản phẩm...</div>}
            </div>
          : <div className="flex flex-col h-full items-center justify-center">
            <div><Package size={52} color="#cccccc" weight="bold" /></div>
            <div className="font-bold mt-4 mb-2">Không tìm thấy sản phẩm nào</div>
            <div>Vui lòng quay trở lại sau hoặc tải lại trang</div>
          </div>
        }
        
      </div>
    </div>
  )
}

export default CategoryItems
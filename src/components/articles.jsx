import React from "react"
import { useNavigate } from "react-router-dom"
import ArticleItem from "./article-item"

const Articles = ({blog}) => {
  const navigate = useNavigate()

  return (
    <div className="mt-4">
      <div className="flex justify-between font-bold pb-2">
        {/* <span className="text-[14px]">{blog ?.name}</span> */}
        <span className="text-[14px]">Tin tức</span>
        <span onClick={() => navigate('/blog')}>Tất cả</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {
          (blog ?.articles || []).map(el => <ArticleItem article={el} />)
        }
      </div>
    </div>
  )
}

export default Articles
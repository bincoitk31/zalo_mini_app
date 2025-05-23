import React, { useEffect, useState } from "react"
import { blogStore } from "../../recoil/blog"
import { Tabs, Drawer } from "antd"
import { CaretLeft } from "@phosphor-icons/react"
import { resizeLink } from "../../utils/tools"

import ArticleItem from "../../components/article-item"

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [activeKey, setActiveKey] = useState('-1')
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(1)
  const [isCategory, setIsCategory] = useState(true)
  const [articlesCategory, setArticlesCategory] = useState([])
  const [titleCategory, setTitleCategory] = useState('')
  const [openListArticle, setOpenListArticle] = useState(false)

  const getBlogs = async () => {
    const res = await blogStore('getBlogs', {page: 1, limit: 30})
    if (res.status == 200) {
      setBlogs(res.data.blogs.data)
    }
  }

  const getAllArticles = async () => {
    const res = await blogStore('getAllArticles', {page: 1, limit: 30})
    if (res.status == 200) {
      setArticles(res.data.result.articles)
    }
  }

  const getCategoryBlog = async (params) => {
    const res = await blogStore('getArticles', params)
    if (res.status == 200) {
      setArticlesCategory(res.data.result.articles)
      setTitleCategory(res.data.result.name)
    }
  }

  const goToArticles = (id) => {
    setIsCategory(false)
    setOpenListArticle(true)
    let params = {
      category_id: id,
      page: 1,
      limit: 50
    }
    getCategoryBlog(params)
  }

  const children = (key) => {
    return (
      <div className="p-2 h-[calc(100vh-83px)] overflow-y-auto">
        {
          key === '-1'
          ?
            <div className="grid grid-cols-2 gap-2">
              {
                articles.map(el => <ArticleItem article={el} />)
              }
            </div>
          :
            <div className="grid grid-cols-2 gap-2">
              {
                blogs.map(el => (
                  <div className="border border-solid border-[#eee] rounded-lg overflow-hidden" onClick={() => goToArticles(el.id)}>
                    <div>
                      <img src={resizeLink(el.image || "")} className="object-fill w-full h-[80px]" />
                    </div>
                    <div className="px-2 pt-2 pb-2">
                      <div className="font-medium text-truncate-2-line pb-1 h-10">{el.name}</div>
                    </div>
                  </div>
                ))
              }
            </div>
        }
      </div>
    )
  }

  const items = [
    {
      key: '-1',
      label: <div>Tất cả</div>,
      children: children('-1')
    },
    {
      key: '0',
      label: <div>Danh mục</div>,
      children: children('0')
    }
  ]

  const onChange = (key) => {
    setActiveKey(key)
  }
  
  const onClose = () => {
    setOpenListArticle(false)
  }

  useEffect(() => {
    getBlogs()
    getAllArticles()
  }, [])

  return (
    <>
      <div className="absolute top-[44px] bg-[#fff] h-[calc(100vh-36px)] overflow-y-auto w-full">
        <Tabs activeKey={activeKey} className="custom-tabs" defaultActiveKey="-1" items={items} onChange={onChange} />
        <Drawer
          placement={'right'}
          closable={false}
          onClose={onClose}
          open={openListArticle}
          className="custom-drawer"
        >
          <div>
            <div className="flex items-center p-3 border-b border-b-solid border-b-[#d9d9d9]">
              <div onClick={onClose}><CaretLeft size={24} color="#000" weight="light" /></div>
              <div className="font-bold text-center truncate">{titleCategory}</div>
            </div>
            <div className="h-[calc(100vh-49px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-2">
                {
                  articlesCategory.map(el => <ArticleItem article={el} />)
                }
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  )
}

export default Blog
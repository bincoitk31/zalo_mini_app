import { useNavigate } from "react-router-dom"
import { Eye } from '@phosphor-icons/react'
import { articleState } from "../recoil/blog"
import { useSetRecoilState } from "recoil"
import { resizeLink } from "../utils/tools"

const ArticleItem = ({article}) => {
  const navigate = useNavigate()
  const setArticleState = useSetRecoilState(articleState)

  const goToArticle = () => {
    setArticleState(article)
    navigate(`/blog/article`)
    //navigate(`/blog/post/${article.id}`)
  }

  return (
    <div className="border border-solid border-[#eee] rounded-lg overflow-hidden" onClick={() => goToArticle(article.id)}>
    <div>
      <img src={resizeLink(article.images?.[0] || "")} className="object-cover w-full h-[80px]" />
    </div>
    <div className="px-2 pt-2 pb-2">
      <div className="font-medium text-truncate-2-line pb-1 h-11">{article.name}</div>
      <div className="flex text-[12px] items-center text-[#757575]">
        <div className="pr-2">{article.render_inserted_at}</div>
        <div className="flex items-center">
          <Eye size={12} color="#757575" weight="fill" />
          <div className="pl-1">{article.total_view_web}</div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ArticleItem
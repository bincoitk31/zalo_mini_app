import React, { useEffect} from "react"
import { useSetRecoilState, useRecoilValue } from "recoil"
import { activeTabState } from "../../recoil/atoms"
import { articleState } from "../../recoil/blog"
import { Eye } from '@phosphor-icons/react'
import { resizeLink, resizeDescription } from "../../utils/tools"

const Article = () => {
  const setActiveTab = useSetRecoilState(activeTabState)
  const article = useRecoilValue(articleState)

  useEffect(() => {
    setActiveTab('article')
  }, [])

  return (
    <>
      <div className="mt-[44px] overflow-y-auto bg-[#f3f3f3] h-[calc(100vh-36px)]" >
        <div>
          <img src={resizeLink(article ?.images[0] || "")} className="object-cover w-full h-[160px]" />
        </div>
        <div className="p-2 bg-[#fff] my-2">
          <div className="font-bold text-[18px] pb-2">{article.name}</div>
          <div className="flex text-[12px] items-center text-[#757575]">
            <div className="pr-2">{article.render_inserted_at}</div>
            <div className="flex items-center">
              <Eye size={12} color="#757575" weight="fill" />
              <div className="pl-1">{article.total_view_web}</div>
            </div>
          </div>
        </div>
        <div className="p-2 bg-[#fff]" dangerouslySetInnerHTML={{__html: resizeDescription(article.compress_content || article.content)}}></div>
      </div>
    </>
  )
}

export default Article
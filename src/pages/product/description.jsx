import { resizeDescription } from "../../utils/tools"
const Description = ({product}) => {
  return (
    <div className="text-[12px]">
      <div className="font-bold py-3">Chi tiết sản phẩm</div>
      <div dangerouslySetInnerHTML={{__html: resizeDescription(product.description)}}></div>
    </div>
  )
}

export default Description
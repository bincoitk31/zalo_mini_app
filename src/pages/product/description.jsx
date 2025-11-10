import { resizeDescription } from "../../utils/tools"
const Description = ({product}) => {
  return (
    <div className="">
      <div className="font-bold py-3">Chi tiết sản phẩm</div>
     
      {/* <div className="default-style" dangerouslySetInnerHTML={{__html: resizeDescription(product.description)}}></div> */}
      <div className="default-style">
        <p dangerouslySetInnerHTML={{__html: resizeDescription(product.description)}}></p>
      </div>
    </div>
  )
}

export default Description
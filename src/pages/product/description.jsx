import { resizeDescription } from "../../utils/tools"
const Description = ({product}) => {
  const convertDes = (des) => {
    return des.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join("<br />")
  }

  return (
    <div className="">
      <div className="font-bold py-3">Chi tiết sản phẩm</div>
      <div className="default-style" dangerouslySetInnerHTML={{__html: /^\<.+\>/.test(product.description) ? resizeDescription(product.description) : convertDes(product.description)}}></div>
    </div>
  )
}

export default Description
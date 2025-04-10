import React, { useState } from "react"
import {Carousel, Modal} from 'antd'
import { CaretLeft, ShareNetwork } from "@phosphor-icons/react"
import { openShareSheet } from "zmp-sdk/apis"
import { resizeLink } from "../../utils/tools"

const SliderProduct = ({images, product}) => {
  const [current, setCurrent] = useState(0)
  const [open, setOpen] = useState(false)

  console.log(product, "pppppp")

  const renderNav = () => {
    return (
      images.map((src, idx) => (
        <div key={idx} className="w-full h-[360px]">
          <img src={resizeLink(src)} className="w-full h-full object-cover" />
        </div>
      ))
    )
  }

  const afterChange = (number) => {
    setCurrent(number)
  }

  const shareCurrentPage = async (e) => {
    e.stopPropagation()
    try {
      const meta_tags = product?.meta_tags || []
      let title = meta_tags.find(el => el.type == "meta" && el.props.property == "page_title")
      if (title) title = title.props.content
      let description = meta_tags.find(el => el.type == "meta" && el.props.property == "meta_description")
      if (description) description.props.content

      const data = await openShareSheet({
        type: "zmp_deep_link",
        data: {
          title: title || product?.name || 'no name',
          description: description || '',
          thumbnail: product?.variations?.[0].images?.[0],
        },
      });
    } catch (err) {}
  };

  return (
    <div >
      <div className="relative" onClick={() => setOpen(true)}>
        <Carousel afterChange={afterChange} dots={false}>
          {renderNav()}
        </Carousel>
        <div className="absolute bottom-0 right-4 bg-[#00000080] text-[12px] text-[#fff] px-2 rounded-t-[4px]">
          {current + 1} / {images.length}
        </div>
        <div onClick={(e) => shareCurrentPage(e)} className="flex items-center justify-center absolute top-2 right-4 bg-[#00000080] px-2 rounded-[4px] w-[40px] h-[40px]"><ShareNetwork size={22} color="#fff" /></div>
      </div>
      
      <Modal
        className="modal-custom-fullscreen"
        open={open}
        width={"100%"}
        footer={null}
        closable={false}
      >
        <div className="h-full">
          <div className="fixed top-[8px] left-[8px] z-[9999]" onClick={() => setOpen(false)}><CaretLeft size={20} color="#fff" /></div>
          <Carousel afterChange={afterChange} dots={true}>
            {renderNav()}
          </Carousel>
         
        </div>
        
      </Modal>
    </div>
  );
}

export default SliderProduct
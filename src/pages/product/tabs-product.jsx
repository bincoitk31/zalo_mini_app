import { Tabs } from "antd"
import { useState } from "react"

const TabsProduct = ({product}) => {
  const [activeKey, setActiveKey] = useState(0)

  const items = (product.short_description || []).map((el, idx) => {
    return {
      key: idx,
      label: el.title,
      children: (<div dangerouslySetInnerHTML={{__html: el.compress_description}}></div>)
    }
  })

  const onChange = (key) => {
    setActiveKey(key)
  };

  return (
    <Tabs
      defaultActiveKey={0}
      items={items}
      onChange={onChange}
      activeKey={activeKey}
    />
  )
}

export default TabsProduct
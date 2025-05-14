import React, { useEffect, useState } from "react";
import { MinusOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { cartItemsState } from "../recoil/order"
import { useRecoilState } from "recoil"
import { Modal, message } from "antd";
import { setDataToStorage } from "../utils/tools"

const { confirm } = Modal;
const Quantity = ({item}) => {
  const [count, setCount] = useState(0);
  const [cartItems, setCartItems] = useRecoilState(cartItemsState)

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count == 1) {
      console.log('vaooo')
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?',
        onOk() {
          handleRemove()
        },
        onCancel() {}
      })
      
    } else {
      setCount(count - 1);
    }
  };
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCount(value);
    }
  };

  const calcQuantity = () => {
    let idx = cartItems.findIndex(el => el.id == item.id)
    let newCartItems = cartItems.map((el, index) => index === idx ? {...el, quantity: count} : el)
    console.log(newCartItems, "newCart")
    setCartItems(newCartItems)
  }

  const handleRemove = () => {
    let newCartItems = cartItems.filter(el => el.id != item.id)
    setCartItems(newCartItems)
    setDataToStorage("cart-items", newCartItems)
    message.success('Xóa sản phẩm thành công')
  }

  useEffect(() => {
    setCount(item.quantity)
  }, [])

  useEffect(() => {
    console.log(count, "countt")
    calcQuantity()
  }, [count])

  return (
    <div className="btn-quantity">
      {/* <button className={`btn-minus ${count == 1 ? 'opacity-50' : ''}`} onClick={decrement}> */}
      <button className="btn-minus" onClick={decrement}>
        <MinusOutlined />
      </button>
      <input onChange={handleChange} type="number" className="quantity" value={count} />
      <button className="btn-plus" onClick={increment}>
        <PlusOutlined />
      </button>
    </div>
  );
};

export default Quantity;
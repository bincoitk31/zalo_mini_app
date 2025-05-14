import React from "react";
import ProductItem from "./product-item";

const ProductList = (props) => {
  const data = props.products.data || []

  return (
    <div
      className="flex overflow-x-auto"
    >
      {data.map((product) => (
        <div className="pr-3 shrink-0 w-[140px]">
          <ProductItem key={product.id} product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductList
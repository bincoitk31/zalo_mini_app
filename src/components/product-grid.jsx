import React, { useEffect } from "react";
import ProductItem from "./product-item";

const ProductGrid = (props) => {
  const data = props.products.data || []
  return (
    <div
      className="grid grid-cols-2 py-4 gap-4"
    >
      {data.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
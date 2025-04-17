import { useState } from "react";

export function useProductList() {
  const [productList, setProductList] = useState([
    { id: "p1", name: "상품1", value: 10000, quantity: 50 },
    { id: "p2", name: "상품2", value: 20000, quantity: 30 },
    { id: "p3", name: "상품3", value: 30000, quantity: 20 },
    { id: "p4", name: "상품4", value: 15000, quantity: 0 },
    { id: "p5", name: "상품5", value: 25000, quantity: 10 },
  ]);

  const updateProductQuantity = ({ quantityOffset, targetProduct }) => {
    setProductList((prev) =>
      prev.map((product) =>
        product.id === targetProduct.id
          ? { ...product, quantity: product.quantity + quantityOffset }
          : product,
      ),
    );
  };

  return { productList, updateProductQuantity };
}

import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { Product } from "../entities";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

function App() {
  const [productList, setProductList] = useState([
    { id: "p1", name: "상품1", value: 10000, quantity: 50 },
    { id: "p2", name: "상품2", value: 20000, quantity: 30 },
    { id: "p3", name: "상품3", value: 30000, quantity: 20 },
    { id: "p4", name: "상품4", value: 15000, quantity: 0 },
    { id: "p5", name: "상품5", value: 25000, quantity: 10 },
  ]);

  const [totalAmount, setTotalAmount] = useState(0);

  const [lastSelected, setLastSelected] = useState(null);

  const [cartItems, setCartItems] = useState<
    { product: Product; quantity: number }[]
  >([]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" className="text-xl font-bold my-4"></div>
        <select id="product-select" className="border rounded p-2 mr-2">
          {productList.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.quantity === 0}
            >
              {product.name} - {product.value}원
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  );
}

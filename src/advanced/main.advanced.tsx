import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { Product } from "../entities";
import { useMemo } from "react";
import { onAddButtonClick } from "../basic/main.basic";
import { getSelectedProduct, hasProductStock } from "../shared";

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

  const [selectedItemId, setSelectedItemId] = useState<string>(
    productList[0].id,
  );

  const bonusPoints = useMemo(
    () => Math.floor(totalAmount / 1000),
    [totalAmount],
  );

  const handleAddButtonClick = () => {
    const selectedProduct = getSelectedProduct({
      productList,
      selectedItemId,
    });

    if (hasProductStock(selectedProduct)) {
      const item = cartItems.find(
        (cartItem) => cartItem.product.id === selectedProduct.id,
      );

      const nextQuantity = item ? item.quantity + 1 : 1;

      const updateProductQuantity = () => {
        setProductList((prev) =>
          prev.map((product) =>
            product.id === selectedProduct.id
              ? { ...product, quantity: product.quantity - 1 }
              : product,
          ),
        );
      };

      const updateCartItem = () => {
        setCartItems((prev) =>
          prev.map((cartItem) =>
            cartItem.product.id === selectedProduct.id
              ? { ...cartItem, quantity: nextQuantity }
              : cartItem,
          ),
        );

        updateProductQuantity();
      };

      const addToCart = () => {
        setCartItems((prev) => [
          ...prev,
          { product: selectedProduct, quantity: nextQuantity },
        ]);

        updateProductQuantity();
      };

      onAddButtonClick({
        selectedProduct,
        nextQuantity,
        updateCartItems: item ? updateCartItem : addToCart,
      });
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cartItems.map((cartItem) => (
            <div
              key={cartItem.product.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                ${cartItem.product.name} - ${cartItem.product.value}원 x 1
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={cartItem.product.id}
                  data-change="-1"
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={cartItem.product.id}
                  data-change="1"
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  data-product-id={cartItem.product.id}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          <span id="loyalty-points" className="text-blue-500 ml-2">
            (포인트: {bonusPoints})
          </span>
        </div>
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          onChange={(e) => {
            console.log("TCL: App -> e.target.value", e.target.value);
            setSelectedItemId(e.target.value);
          }}
        >
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
          onClick={handleAddButtonClick}
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  );
}

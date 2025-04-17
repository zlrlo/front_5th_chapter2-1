import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { Product } from "../entities";
import { useMemo } from "react";
import { onAddButtonClick } from "../basic/main.basic";
import {
  getSelectedProduct,
  hasProductStock,
  isQuantityInRange,
} from "../shared";
import { useProductList } from "./hooks/useProductList";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

function App() {
  const { productList, updateProductQuantity } = useProductList();

  const [totalAmount, setTotalAmount] = useState(0);

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

      const updateCartItem = () => {
        setCartItems((prev) =>
          prev.map((cartItem) =>
            cartItem.product.id === selectedProduct.id
              ? { ...cartItem, quantity: nextQuantity }
              : cartItem,
          ),
        );

        updateProductQuantity({
          quantityOffset: -1,
          targetProduct: selectedProduct,
        });
      };

      const addToCart = () => {
        setCartItems((prev) => [
          ...prev,
          { product: selectedProduct, quantity: nextQuantity },
        ]);

        updateProductQuantity({
          quantityOffset: -1,
          targetProduct: selectedProduct,
        });
      };

      onAddButtonClick({
        selectedProduct,
        nextQuantity,
        updateCartItems: item ? updateCartItem : addToCart,
      });
    }
  };

  const handleRemoveButtonClick = (product: Product) => {
    setCartItems((prev) =>
      prev.filter((cartItem) => cartItem.product.id !== product.id),
    );

    updateProductQuantity({
      quantityOffset: product.quantity,
      targetProduct: product,
    });
  };

  const addQuantity = ({ curQuantity, targetProduct }) => {
    const quantityOffset = 1;

    if (
      isQuantityInRange({
        curQuantity,
        quantityOffset,
        productQuantity: targetProduct.quantity,
      })
    ) {
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.product.id === targetProduct.id
            ? { ...cartItem, quantity: curQuantity + quantityOffset }
            : cartItem,
        ),
      );

      updateProductQuantity({
        quantityOffset: -quantityOffset,
        targetProduct,
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
                ${cartItem.product.name} - ${cartItem.product.value}원 x
                {cartItem.quantity}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={cartItem.product.id}
                  data-change="-1"
                  onClick={() => {}}
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={cartItem.product.id}
                  data-change="1"
                  onClick={() =>
                    addQuantity({
                      curQuantity: cartItem.quantity,
                      targetProduct: cartItem.product,
                    })
                  }
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  data-product-id={cartItem.product.id}
                  onClick={() => handleRemoveButtonClick(cartItem.product)}
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

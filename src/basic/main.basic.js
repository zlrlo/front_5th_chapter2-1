import {
  getSelectedProduct,
  hasProductStock,
  isQuantityInRange,
} from "../shared";

import {
  BULK_DISCOUNT_THRESHOLD,
  BULK_DISCOUNT_RATE,
  PRODUCT_DISCOUNT_RATE,
} from "../constants";

const productList = [
  { id: "p1", name: "상품1", value: 10000, quantity: 50 },
  { id: "p2", name: "상품2", value: 20000, quantity: 30 },
  { id: "p3", name: "상품3", value: 30000, quantity: 20 },
  { id: "p4", name: "상품4", value: 15000, quantity: 0 },
  { id: "p5", name: "상품5", value: 25000, quantity: 10 },
];

let totalAmount = 0;
let lastSelected;

function main() {
  renderLayout();
  renderSelectOptions();
  renderStockInfo();

  calculateCart();
  renderBonusPoints();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.value = Math.round(luckyItem.value * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        renderSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelected) {
        const suggest = productList.find(
          (product) => product.id !== lastSelected && product.quantity > 0,
        );

        if (suggest) {
          alert(
            suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!",
          );
          suggest.value = Math.round(suggest.value * 0.95);
          renderSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);

  const addButtonNode = document.getElementById("add-to-cart");
  addButtonNode.addEventListener("click", function () {
    const selectNode = document.getElementById("product-select");
    const selectedItemId = selectNode.value;
    const selectedProduct = getSelectedProduct({
      productList,
      selectedItemId,
    });

    if (hasProductStock(selectedProduct)) {
      const item = document.getElementById(selectedProduct.id);

      if (item) {
        const nextQuantity =
          parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;

        onAddButtonClick({
          selectedProduct,
          nextQuantity,
          updateCartItems,
        });
      } else renderNewItem({ selectedProduct });

      calculateCart();
      renderStockInfo();
      renderBonusPoints();
      lastSelected = selectedProduct.id;
    }
  });

  const cartDisplayNode = document.getElementById("cart-items");
  cartDisplayNode.addEventListener("click", handleCartDisplayClick);
}

main();

function renderLayout() {
  const rootNode = document.getElementById("app");

  const containerNode = document.createElement("div");
  containerNode.className = "bg-gray-100 p-8";

  const wrapNode = document.createElement("div");
  wrapNode.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";

  const titleNode = document.createElement("h1");
  titleNode.className = "text-2xl font-bold mb-4";
  titleNode.textContent = "장바구니";

  const cartDisplayNode = document.createElement("div");
  cartDisplayNode.id = "cart-items";

  const sumNode = document.createElement("div");
  sumNode.id = "cart-total";

  const selectNode = document.createElement("select");
  selectNode.id = "product-select";

  const addButtonNode = document.createElement("button");
  addButtonNode.id = "add-to-cart";

  const stockInfoNode = document.createElement("div");
  stockInfoNode.id = "stock-status";

  sumNode.className = "text-xl font-bold my-4";
  selectNode.className = "border rounded p-2 mr-2";
  addButtonNode.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfoNode.className = "text-sm text-gray-500 mt-2";
  addButtonNode.textContent = "추가";

  wrapNode.appendChild(titleNode);
  wrapNode.appendChild(cartDisplayNode);
  wrapNode.appendChild(sumNode);
  wrapNode.appendChild(selectNode);
  wrapNode.appendChild(addButtonNode);
  wrapNode.appendChild(stockInfoNode);
  containerNode.appendChild(wrapNode);
  rootNode.appendChild(containerNode);
}

function renderSelectOptions() {
  const selectNode = document.getElementById("product-select");
  selectNode.innerHTML = "";
  productList.forEach(function (item) {
    const optionNode = document.createElement("option");
    optionNode.value = item.id;
    optionNode.textContent = `${item.name} - ${item.value}원`;
    if (item.quantity === 0) optionNode.disabled = true;
    selectNode.appendChild(optionNode);
  });
}

function renderStockInfo() {
  const stockInfoNode = document.getElementById("stock-status");
  let infoMessage = "";
  productList.forEach(function (product) {
    if (product.quantity < 5) {
      infoMessage += `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절"}\n`;
    }
  });
  stockInfoNode.textContent = infoMessage;
}

function renderNewItem({ selectedProduct }) {
  const cartDisplayNode = document.getElementById("cart-items");
  const newItem = document.createElement("div");
  newItem.id = selectedProduct.id;
  newItem.className = "flex justify-between items-center mb-2";
  newItem.innerHTML = `
    <span>${selectedProduct.name} - ${selectedProduct.value}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button>
    </div>`;
  cartDisplayNode.appendChild(newItem);
  selectedProduct.quantity--;
}

function renderBonusPoints() {
  const sumNode = document.getElementById("cart-total");
  const bonusPoints = Math.floor(totalAmount / 1000);
  let pointsTagNode = document.getElementById("loyalty-points");
  if (!pointsTagNode) {
    pointsTagNode = document.createElement("span");
    pointsTagNode.id = "loyalty-points";
    pointsTagNode.className = "text-blue-500 ml-2";
    sumNode.appendChild(pointsTagNode);
  }
  pointsTagNode.textContent = `(포인트: ${bonusPoints})`;
}

function calculateCart() {
  totalAmount = 0;
  let itemCount = 0;

  const cartDisplayNode = document.getElementById("cart-items");
  const cartItemNodes = cartDisplayNode.children;
  let subTotal = 0;

  [...cartItemNodes].forEach((cartItem) => {
    const curItem = productList.find((product) => product.id === cartItem.id);
    const quantity = parseInt(
      cartItem.querySelector("span").textContent.split("x ")[1],
    );
    const itemTotal = curItem.value * quantity;

    const discountRate = quantity >= 10 ? PRODUCT_DISCOUNT_RATE[curItem.id] : 0;

    itemCount += quantity;
    subTotal += itemTotal;

    totalAmount += itemTotal * (1 - discountRate);
  });

  let discountRate = 0;

  if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  const sumNode = document.getElementById("cart-total");
  sumNode.textContent = "총액: " + Math.round(totalAmount) + "원";

  if (discountRate > 0) {
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    sumNode.appendChild(span);
  }
}

export function onAddButtonClick({
  selectedProduct,
  nextQuantity,
  updateCartItems,
}) {
  if (nextQuantity <= selectedProduct.quantity) {
    updateCartItems({ selectedProduct, nextQuantity });
  } else {
    alert("재고가 부족합니다.");
  }
}

function updateCartItems({ selectedProduct, nextQuantity }) {
  const item = document.getElementById(selectedProduct.id);
  item.querySelector("span").textContent =
    `${selectedProduct.name} - ${selectedProduct.value}원 x ${nextQuantity}`;
  selectedProduct.quantity--;
}

function handleCartDisplayClick(event) {
  const target = event.target;

  if (
    !target.classList.contains("quantity-change") &&
    !target.classList.contains("remove-item")
  )
    return;

  const curProductId = target.dataset.productId;
  const itemNode = document.getElementById(curProductId);
  const curProduct = productList.find((product) => product.id === curProductId);
  const curQuantity = parseInt(
    itemNode.querySelector("span").textContent.split("x ")[1],
  );

  if (target.classList.contains("quantity-change")) {
    const quantityOffset = parseInt(target.dataset.change);

    const nextQuantity = curQuantity + quantityOffset;

    if (
      isQuantityInRange({
        curQuantity,
        quantityOffset,
        productQuantity: curProduct.quantity,
      })
    ) {
      itemNode.querySelector("span").textContent =
        `${curProduct.name} - ${curProduct.value}원 x ${nextQuantity}`;

      curProduct.quantity -= quantityOffset;
    } else if (nextQuantity <= 0) {
      itemNode.remove();
      curProduct.quantity -= quantityOffset;
    } else {
      alert("재고가 부족합니다.");
    }
  } else if (target.classList.contains("remove-item")) {
    curProduct.quantity += curQuantity;
    itemNode.remove();
  }
  calculateCart();
  renderStockInfo();
  renderBonusPoints();
}

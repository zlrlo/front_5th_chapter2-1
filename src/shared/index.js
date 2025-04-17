export function getSelectedProduct({ productList, selectedItemId }) {
  return productList.find((product) => product.id === selectedItemId);
}

export const hasProductStock = (product) => {
  return product && product.quantity > 0;
};

export const isQuantityInRange = ({
  curQuantity,
  quantityOffset,
  productQuantity,
}) => {
  const nextQuantity = curQuantity + quantityOffset;
  return nextQuantity > 0 && nextQuantity <= productQuantity + curQuantity;
};

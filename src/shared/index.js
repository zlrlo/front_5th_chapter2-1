export function getSelectedProduct({ productList, selectedItemId }) {
  return productList.find((product) => product.id === selectedItemId);
}

export const hasProductStock = (product) => {
  return product && product.quantity > 0;
};

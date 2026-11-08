import { getCartItems, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  if (!product) return;

  const cartItems = getCartItems();
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  window.dispatchEvent(new Event('cart-updated'));
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.currentTarget.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

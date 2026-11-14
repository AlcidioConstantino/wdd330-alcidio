import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const savedCart = getLocalStorage("so-cart");
  const cartItems = Array.isArray(savedCart) ? savedCart : savedCart ? [savedCart] : [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.length
    ? htmlItems.join("")
    : "<li class=\"empty-cart\">Your cart is empty.</li>";
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

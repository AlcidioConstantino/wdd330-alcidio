import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const CART_KEY = "so-cart";

function getCart() {
  const saved = getLocalStorage(CART_KEY);
  return Array.isArray(saved) ? saved : saved ? [saved] : [];
}

function renderCart() {
  const cart = getCart();
  const list = document.querySelector("[data-checkout-items]");
  const total = document.querySelector("[data-order-total]");
  list.innerHTML = cart.map((item) => `<li>${item.Name} <span>$${Number(item.FinalPrice).toFixed(2)}</span></li>`).join("");
  total.textContent = `$${cart.reduce((sum, item) => sum + Number(item.FinalPrice || 0), 0).toFixed(2)}`;
  if (!cart.length) alertMessage("Your cart is empty. Add an item before checking out.", false);
}

export default class CheckoutProcess {
  constructor() {
    this.services = new ExternalServices();
  }

  async checkout(form) {
    const cart = getCart();
    if (!cart.length) {
      alertMessage("Your cart is empty. Add an item before checking out.");
      return;
    }
    const formData = new FormData(form);
    const order = Object.fromEntries(formData.entries());
    order.expiration = order.expiration.replace(/^([0-9]{2})([0-9]{2})$/, "$1/$2");
    order.orderDate = new Date().toISOString();
    order.cart = cart;
    try {
      await this.services.checkout(order);
      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("cart-updated"));
      window.location.assign("success.html");
    } catch (error) {
      const details = error?.name === "servicesError" ? error.message : "Please check your connection and try again.";
      const readableDetails = typeof details === "string"
        ? details
        : Object.entries(details || {}).map(([field, message]) => `${field}: ${message}`).join("\n");
      alertMessage(readableDetails || "Your order could not be completed. Please review the form and try again.");
    }
  }
}

renderCart();

const form = document.querySelector("#checkout-form");
if (form) {
  const checkout = new CheckoutProcess();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = form.checkValidity();
    form.reportValidity();
    if (valid) checkout.checkout(form);
  });
}

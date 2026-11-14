import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import { getParam } from "./utils.mjs";
import { appendProductToCart } from "./cartHelpers.js";
import Breadcrumbs from "./Breadcrumbs.mjs";

const dataSource = new ProductData("tents");
const breadcrumbs = new Breadcrumbs();

async function loadProductDetails() {
  const productId = getParam("product");
  const section = document.querySelector(".product-detail");
  if (!section) return;
  if (!productId) {
    breadcrumbs.renderProduct(section.dataset.category);
    return;
  }
  try {
    const product = await dataSource.findProductById(productId);
    if (!product) throw new Error("Product not found");
    const categoryImages = {
      tents: "/images/noun_Tent_2517.svg",
      backpacks: "/images/noun_Backpack_65884.svg",
      "sleeping-bags": "/images/noun_Sleeping_Bag.svg",
      hammocks: "/images/noun_Hammock.svg",
    };
    const image = product.Image?.startsWith("http") || product.Image?.startsWith("/")
      ? product.Image
      : product.Image
        ? `/${product.Image.replace(/^\.\.\//, "")}`
        : categoryImages[product.Category] || categoryImages.tents;
    section.innerHTML = `<h3>${product.Brand?.Name || "Outdoor Gear"}</h3>
      <h2 class="divider">${product.NameWithoutBrand || product.Name}</h2>
      <img class="divider" src="${image}" alt="${product.Name}" />
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p class="product__color">${product.Colors?.[0]?.ColorName || ""}</p>
      <p class="product__description">${product.DescriptionHtmlSimple || ""}</p>
      <div class="product-detail__add"><button id="addToCart" data-id="${product.Id}">Add to Cart</button></div>`;
    breadcrumbs.renderProduct(product.Category || getParam("category"));
    document.title = `Sleep Outside | ${product.Name}`;
    document.getElementById("addToCart").addEventListener("click", addToCartHandler);
  } catch (error) {
    console.error("Unable to load product:", error);
    section.innerHTML = "<p>This product could not be loaded.</p>";
  }
}

function addProductToCart(product) {
  const savedCart = getLocalStorage("so-cart");
  setLocalStorage("so-cart", appendProductToCart(savedCart, product));
  window.dispatchEvent(new Event("cart-updated"));
}
// add to cart button event handler
async function addToCartHandler(e) {
  const button = e.currentTarget;
  button.disabled = true;
  button.textContent = "Adding…";
  try {
    const product = await dataSource.findProductById(button.dataset.id);
    if (!product) throw new Error("Product was not returned by the server");
    addProductToCart(product);
    button.textContent = "Added to Cart";
  } catch (error) {
    console.error("Unable to add product to cart:", error);
    button.textContent = "Try Again";
    button.disabled = false;
  }
}

// add listener to Add to Cart button
const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) addToCartButton.addEventListener("click", addToCartHandler);
loadProductDetails();

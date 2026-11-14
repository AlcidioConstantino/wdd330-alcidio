import { qs } from "./utils.mjs";
import Breadcrumbs from "./Breadcrumbs.mjs";

function imagePath(image) {
  if (!image) return "";
  if (/^(https?:)?\/\//.test(image) || image.startsWith("/")) return image;
  return `/${image.replace(/^\.\.\//, "")}`;
}

const categoryImages = {
  tents: "/images/noun_Tent_2517.svg",
  backpacks: "/images/noun_Backpack_65884.svg",
  "sleeping-bags": "/images/noun_Sleeping_Bag.svg",
  hammocks: "/images/noun_Hammock.svg",
};

function productCardTemplate(product, category) {
  const brand = product.Brand?.Name || "Outdoor Gear";
  const name = product.NameWithoutBrand || product.Name;
  const image = imagePath(product.Image) || categoryImages[category];
  const id = encodeURIComponent(product.Id);
  return `<li class="product-card">
    <a href="/product_pages/?product=${id}&category=${encodeURIComponent(category)}">
      <img src="${image}" alt="${name}" />
      <h3 class="card__brand">${brand}</h3>
      <h2 class="card__name">${name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement = qs(".product-list")) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.breadcrumbs = new Breadcrumbs();
  }

  async init() {
    if (!this.listElement) return;
    this.listElement.innerHTML = "<li>Loading products…</li>";
    try {
      const products = await this.dataSource.getData(this.category);
      this.renderList(products || []);
    } catch (error) {
      console.error(`Unable to load ${this.category}:`, error);
      this.listElement.innerHTML = "<li>Products could not be loaded. Please try again later.</li>";
    }
  }

  renderList(list) {
    const products = Array.isArray(list) ? list : [];
    this.breadcrumbs.renderListing(this.category, products.length);
    this.listElement.innerHTML = products
      .map((product) => productCardTemplate(product, this.category))
      .join("");
  }
}

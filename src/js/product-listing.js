import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";

const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
const requestedCategory = getParam("category") || "tents";
const category = categories.includes(requestedCategory) ? requestedCategory : "tents";

const heading = document.querySelector("[data-category-title]");
if (heading) heading.textContent = category.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

new ProductList(category, new ProductData()).init();

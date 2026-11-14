import { qs } from "./utils.mjs";

const categoryLabels = {
  tents: "Tents",
  backpacks: "Backpacks",
  "sleeping-bags": "Sleeping Bags",
  hammocks: "Hammocks",
};

export function getCategoryLabel(category) {
  if (!category) return "";
  return (
    categoryLabels[category] ||
    category.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

export default class Breadcrumbs {
  constructor(element = qs("[data-breadcrumbs]")) {
    this.element = element;
  }

  renderListing(category, itemCount) {
    if (!this.element) return;

    const list = document.createElement("ol");
    const categoryItem = document.createElement("li");
    categoryItem.textContent = getCategoryLabel(category);
    categoryItem.setAttribute("aria-current", "page");

    const countItem = document.createElement("li");
    countItem.textContent = `(${itemCount} ${itemCount === 1 ? "item" : "items"})`;

    list.append(categoryItem, countItem);
    this.element.replaceChildren(list);
    this.element.hidden = false;
  }

  renderProduct(category) {
    if (!this.element || !category) return;

    const list = document.createElement("ol");
    const categoryItem = document.createElement("li");
    const categoryLink = document.createElement("a");
    categoryLink.href = `/product_listing/?category=${encodeURIComponent(category)}`;
    categoryLink.textContent = getCategoryLabel(category);
    categoryItem.append(categoryLink);
    list.append(categoryItem);

    this.element.replaceChildren(list);
    this.element.hidden = false;
  }
}

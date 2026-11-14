import { describe, expect, test } from "@jest/globals";
import { appendProductToCart } from "../js/cartHelpers.js";

describe("appendProductToCart", () => {
  test("creates a cart containing the first product", () => {
    const product = { Id: "880RR" };

    expect(appendProductToCart(null, product)).toEqual([product]);
  });

  test("appends a product without replacing existing cart items", () => {
    const firstProduct = { Id: "880RR" };
    const secondProduct = { Id: "985RF" };

    expect(appendProductToCart([firstProduct], secondProduct)).toEqual([
      firstProduct,
      secondProduct,
    ]);
  });

  test("converts a previously stored single product to a cart array", () => {
    const previousProduct = { Id: "880RR" };
    const nextProduct = { Id: "985RF" };

    expect(appendProductToCart(previousProduct, nextProduct)).toEqual([
      previousProduct,
      nextProduct,
    ]);
  });
});

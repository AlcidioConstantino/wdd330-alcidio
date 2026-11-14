export function appendProductToCart(savedCart, product) {
  const cart = Array.isArray(savedCart) ? savedCart : savedCart ? [savedCart] : [];
  return [...cart, product];
}

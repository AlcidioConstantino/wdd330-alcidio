const CART_STORAGE_KEY = 'so-cart';

export function getCartItemCount(cart) {
  if (Array.isArray(cart)) return cart.length;
  return cart !== null && typeof cart === 'object' ? 1 : 0;
}

export function updateCartCount(root = document, storage = window.localStorage) {
  let cart = null;

  try {
    cart = JSON.parse(storage?.getItem(CART_STORAGE_KEY) ?? 'null');
  } catch {
    cart = null;
  }

  const count = getCartItemCount(cart);

  root.querySelectorAll('[data-cart-count]').forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;

    const link = badge.closest('[data-cart-link]');
    if (link) {
      const itemLabel = count === 1 ? 'item' : 'items';
      link.setAttribute('aria-label', `Shopping cart, ${count} ${itemLabel}`);
    }
  });

  return count;
}

export function initCartCount(
  windowRef = window,
  root = document,
  storage = window.localStorage,
) {
  const refresh = () => updateCartCount(root, storage);

  windowRef.addEventListener('cart-updated', refresh);
  windowRef.addEventListener('storage', (event) => {
    if (event.key === CART_STORAGE_KEY || event.key === null) refresh();
  });

  refresh();
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  initCartCount();
}

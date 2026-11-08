import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getCartItemCount,
  initCartCount,
  updateCartCount,
} from '../js/cartCount.mjs';

function makeBadge() {
  const link = { setAttribute: (name, value) => (link[name] = value) };
  return {
    hidden: true,
    textContent: '',
    closest: (selector) => (selector === '[data-cart-link]' ? link : null),
    link,
  };
}

function makeRoot(badges) {
  return { querySelectorAll: (selector) => (selector === '[data-cart-count]' ? badges : []) };
}

test('counts the current single-product object and array formats', () => {
  assert.equal(getCartItemCount({ Id: '880RR' }), 1);
  assert.equal(getCartItemCount([{ Id: '880RR' }, { Id: '985RF' }]), 2);
  assert.equal(getCartItemCount([]), 0);
  assert.equal(getCartItemCount(null), 0);
});

test('shows the object-format count and updates after a same-page cart event', () => {
  const badge = makeBadge();
  const root = makeRoot([badge]);
  const listeners = new Map();
  const windowRef = {
    addEventListener: (name, callback) => listeners.set(name, callback),
  };
  let storedCart = JSON.stringify({ Id: '880RR' });
  const storage = { getItem: () => storedCart };

  initCartCount(windowRef, root, storage);

  assert.equal(badge.textContent, '1');
  assert.equal(badge.hidden, false);
  assert.equal(badge.link['aria-label'], 'Shopping cart, 1 item');

  storedCart = JSON.stringify([{ Id: '880RR' }, { Id: '985RF' }]);
  listeners.get('cart-updated')();

  assert.equal(badge.textContent, '2');
  assert.equal(badge.link['aria-label'], 'Shopping cart, 2 items');
});

test('hides the badge for an empty cart and refreshes on cross-tab storage changes', () => {
  const badge = makeBadge();
  const root = makeRoot([badge]);
  const listeners = new Map();
  const windowRef = {
    addEventListener: (name, callback) => listeners.set(name, callback),
  };
  let storedCart = null;
  const storage = { getItem: () => storedCart };

  initCartCount(windowRef, root, storage);
  assert.equal(badge.hidden, true);
  assert.equal(badge.textContent, '0');

  storedCart = JSON.stringify([{ Id: '880RR' }]);
  listeners.get('storage')({ key: 'so-cart' });

  assert.equal(badge.hidden, false);
  assert.equal(badge.textContent, '1');
});

test('treats invalid stored JSON as an empty cart', () => {
  const badge = makeBadge();
  const count = updateCartCount(makeRoot([badge]), { getItem: () => '{bad json' });

  assert.equal(count, 0);
  assert.equal(badge.hidden, true);
});

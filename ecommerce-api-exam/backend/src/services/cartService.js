const { client: redis } = require('../config/redis');
const { pool } = require('../config/db');

function cartKey(userId) {
  return `cart:${userId}`;
}

async function getCart(userId) {
  const data = await redis.get(cartKey(userId));
  return data ? JSON.parse(data) : [];
}

async function saveCart(userId, items) {
  await redis.set(cartKey(userId), JSON.stringify(items), { EX: 60 * 60 * 24 }); // 24h
}

async function addToCart(userId, product_id, quantity) {
  const { rows } = await pool.query('SELECT id, price_cents FROM products WHERE id=$1', [product_id]);
  if (!rows[0]) throw new Error('Product not found');
  const price_cents = rows[0].price_cents;
  const cart = await getCart(userId);
  const idx = cart.findIndex(i => i.product_id === product_id);
  if (idx === -1) cart.push({ product_id, quantity, unit_price_cents: price_cents });
  else cart[idx].quantity += quantity;
  await saveCart(userId, cart);
  return cart;
}

async function updateQuantity(userId, product_id, quantity) {
  const cart = await getCart(userId);
  const idx = cart.findIndex(i => i.product_id === product_id);
  if (idx === -1) throw new Error('Item not in cart');
  if (quantity <= 0) cart.splice(idx,1);
  else cart[idx].quantity = quantity;
  await saveCart(userId, cart);
  return cart;
}

async function clearCart(userId) {
  await saveCart(userId, []);
}

module.exports = { getCart, addToCart, updateQuantity, clearCart };

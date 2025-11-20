const Cart = require('../services/cartService');

async function getCart(req, res, next) {
  try { res.json(await Cart.getCart(req.user.sub)); }
  catch (e) { next(e); }
}
async function add(req, res, next) {
  try {
    const { product_id, quantity } = req.body;
    res.status(201).json(await Cart.addToCart(req.user.sub, product_id, Number(quantity || 1)));
  } catch (e) { next(e); }
}
async function updateQty(req, res, next) {
  try {
    const { product_id, quantity } = req.body;
    res.json(await Cart.updateQuantity(req.user.sub, product_id, Number(quantity)));
  } catch (e) { next(e); }
}
async function clear(req, res, next) {
  try {
    await Cart.clearCart(req.user.sub);
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { getCart, add, updateQty, clear };

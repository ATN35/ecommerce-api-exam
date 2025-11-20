const Cart = require('../services/cartService');
const { createOrder } = require('../models/orders');

async function create(req, res, next) {
  try {
    const userId = req.user.sub;
    const items = await Cart.getCart(userId);
    if (!items.length) return res.status(400).json({ error: 'cart is empty' });
    const order = await createOrder(userId, items);
    await Cart.clearCart(userId);
    res.status(201).json(order);
  } catch (e) { next(e); }
}

module.exports = { create };

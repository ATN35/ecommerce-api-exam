const { pool } = require('../config/db')
const Cart = require('../services/cartService')

async function deleteMyAccount(req, res, next) {
  const userId = req.user.sub
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      'DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1)',
      [userId]
    )
    await client.query('DELETE FROM orders WHERE user_id = $1', [userId])

    await client.query('DELETE FROM users WHERE id = $1', [userId])

    await client.query('COMMIT')

    try { await Cart.clearCart(userId) } catch (_) {}

    return res.status(204).end()
  } catch (err) {
    try { await client.query('ROLLBACK') } catch (_) {}
    return next(err)
  } finally {
    client.release()
  }
}

module.exports = { deleteMyAccount }

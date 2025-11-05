const { pool } = require('../config/db')
const Cart = require('../services/cartService')

async function deleteUser(req, res, next) {
  const userId = req.params.id
  try {
    if (req.user?.sub === userId) return res.status(400).json({ error: 'cannot delete your own account' })
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const { rows } = await client.query('SELECT id FROM users WHERE id=$1', [userId])
      if (!rows.length) {
        await client.query('ROLLBACK')
        client.release()
        return res.status(404).json({ error: 'user not found' })
      }
      await client.query('DELETE FROM users WHERE id=$1', [userId])
      await client.query('COMMIT')
      client.release()
    } catch (e) {
      try { await pool.query('ROLLBACK') } catch (_) {}
      return next(e)
    }
    try { await Cart.clearCart(userId) } catch (_) {}
    return res.status(204).end()
  } catch (e) { next(e) }
}

module.exports = { deleteUser }

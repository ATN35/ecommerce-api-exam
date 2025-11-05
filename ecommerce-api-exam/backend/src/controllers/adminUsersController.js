const { pool } = require('../config/db');
const Cart = require('../services/cartService');

async function deleteUser(req, res, next) {
  const userId = req.params.id;
  try {
    if (req.user?.sub === userId) return res.status(400).json({ error: 'cannot delete your own account' });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: exists } = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (!exists.length) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(404).json({ error: 'user not found' });
      }

      await client.query(
        `DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1)`,
        [userId]
      );
      await client.query(`DELETE FROM orders WHERE user_id = $1`, [userId]);

      await client.query('SAVEPOINT sp_addr');
      try { await client.query(`DELETE FROM addresses WHERE user_id = $1`, [userId]); }
      catch (_) { await client.query('ROLLBACK TO SAVEPOINT sp_addr'); }

      await client.query('SAVEPOINT sp_cons');
      try { await client.query(`DELETE FROM consents WHERE user_id = $1`, [userId]); }
      catch (_) { await client.query('ROLLBACK TO SAVEPOINT sp_cons'); }

      await client.query(`DELETE FROM users WHERE id = $1`, [userId]);

      await client.query('COMMIT');
      client.release();

      try { await Cart.clearCart(userId); } catch (_) {}

      return res.status(204).end();
    } catch (e) {
      try { await pool.query('ROLLBACK'); } catch (_) {}
      client.release();
      throw e;
    }
  } catch (e) {
    next(e);
  }
}

module.exports = { deleteUser };

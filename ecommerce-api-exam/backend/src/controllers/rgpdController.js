const { pool } = require('../config/db');
const Cart = require('../services/cartService');

async function setConsent(req, res, next) {
  try {
    const { consent } = req.body;
    if (typeof consent !== 'boolean') return res.status(400).json({ error: 'consent must be boolean' });
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS consent BOOLEAN');
    await pool.query('UPDATE users SET consent=$1 WHERE id=$2', [consent, req.user.sub]);
    res.status(204).end();
  } catch (e) { next(e); }
}

async function getConsent(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT consent FROM users WHERE id=$1', [req.user.sub]);
    if (!rows.length) return res.status(404).json({ error: 'user not found' });
    res.json({ consent: rows[0].consent });
  } catch (e) { next(e); }
}

async function deleteAccount(req, res, next) {
  const userId = req.user.sub;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id=$1)`,
        [userId]
      );
      await client.query(`DELETE FROM orders WHERE user_id=$1`, [userId]);
      try { await client.query(`DELETE FROM addresses WHERE user_id=$1`, [userId]); } catch (_) {}
      try { await client.query(`DELETE FROM consents WHERE user_id=$1`, [userId]); } catch (_) {}
      await client.query(`DELETE FROM users WHERE id=$1`, [userId]);
      await client.query('COMMIT');
      client.release();
    } catch (e) {
      await pool.query('ROLLBACK');
      client.release();
      throw e;
    }
    try { await Cart.clearCart(userId); } catch (_) {}
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { setConsent, getConsent, deleteAccount };

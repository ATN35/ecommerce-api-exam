const { pool } = require('../config/db');
const Cart = require('../services/cartService');

async function deleteMyAccount(req, res, next) {
  const userId = req.user.sub;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM users WHERE id=$1', [userId]);
    await client.query('COMMIT');

    try {
      await Cart.clearCart(userId);
    } catch (_) {}

    return res.status(204).end();
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (_) {}

    return next(err);
  } finally {
    client.release();
  }
}

function logout(_req, res) {
  res.clearCookie(process.env.COOKIE_NAME || 'token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });

  return res.status(204).end();
}

module.exports = { deleteMyAccount, logout };

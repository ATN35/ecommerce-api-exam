const { pool } = require('../config/db');

async function list(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT o.id,
              o.user_id,
              o.total_cents,
              o.status,
              o.created_at
       FROM orders o
       ORDER BY o.created_at DESC`
    );
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}

async function deleteOrder(req, res, next) {
  const orderId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'order not found' });
    }

    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  list,
  deleteOrder,
};

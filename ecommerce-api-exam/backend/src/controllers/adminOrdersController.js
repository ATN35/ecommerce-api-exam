const { pool } = require('../config/db');

async function list(req, res, next) {
  try {
    const q = `
      SELECT o.id, o.user_id, o.total_cents, o.created_at,
        COALESCE(json_agg(
          json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price_cents', oi.price_cents)
        ) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC;`;
    const { rows } = await pool.query(q);
    res.json(rows);
  } catch (e) { next(e); }
}

async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM order_items WHERE order_id=$1', [id]);
    const { rowCount } = await pool.query('DELETE FROM orders WHERE id=$1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'order not found' });
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { list, deleteOrder };

const { pool } = require('../config/db');

async function createOrder(user_id, items) {
  // items: [{product_id, quantity, unit_price_cents}]
  let total = 0;
  for (const it of items) total += it.quantity * it.unit_price_cents;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_cents, status) VALUES ($1,$2,$3) RETURNING *',
      [user_id, total, 'created']
    );
    const order = orderRes.rows[0];
    for (const it of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES ($1,$2,$3,$4)',
        [order.id, it.product_id, it.quantity, it.unit_price_cents]
      );
      await client.query('UPDATE products SET stock = stock - $2 WHERE id=$1', [it.product_id, it.quantity]);
    }
    await client.query('COMMIT');
    return order;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { createOrder };

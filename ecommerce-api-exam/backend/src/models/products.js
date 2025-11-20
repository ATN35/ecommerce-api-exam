const { pool } = require('../config/db');

async function listProducts() {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows;
}

async function getProduct(id) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
  return rows[0] || null;
}

async function createProduct({ name, description, price_cents, stock }) {
  const { rows } = await pool.query(
    'INSERT INTO products (name, description, price_cents, stock) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, description, price_cents, stock]
  );
  return rows[0];
}

async function updateProduct(id, { name, description, price_cents, stock }) {
  const { rows } = await pool.query(
    'UPDATE products SET name=$2, description=$3, price_cents=$4, stock=$5, updated_at=NOW() WHERE id=$1 RETURNING *',
    [id, name, description, price_cents, stock]
  );
  return rows[0];
}

async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id=$1', [id]);
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };

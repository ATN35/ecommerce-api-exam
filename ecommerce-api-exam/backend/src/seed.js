require('dotenv').config({ path: '/app/.env' });
const { pool } = require('./config/db');

async function main() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM products');
  if (rows[0].c === 0) {
    await pool.query("INSERT INTO products (name, description, price_cents, stock) VALUES ('Cap', 'Casquette', 1599, 50)");
    console.log('Seeded one product');
  } else {
    console.log('Products already exist');
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

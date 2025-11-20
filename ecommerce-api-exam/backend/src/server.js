const app = require('./app');
const { initRedis } = require('./config/redis');
const { pool } = require('./config/db');

const port = process.env.PORT || 8080;

async function start() {
  await pool.query('SELECT 1');
  await initRedis();
  app.listen(port, () => console.log(`API running on http://0.0.0.0:${port}`));
}

start().catch((e) => {
  console.error('Failed to start server', e);
  process.exit(1);
});

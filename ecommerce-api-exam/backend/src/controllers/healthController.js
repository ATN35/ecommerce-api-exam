const { pool } = require('../config/db');
const { client: redis, initRedis } = require('../config/redis');

async function health(req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}

async function healthDb(req, res) {
  try {
    const { rows } = await pool.query('SELECT 1 as ok');
    res.json({ db: rows[0].ok === 1 ? 'up' : 'down' });
  } catch (e) {
    res.status(500).json({ db: 'down', error: e.message });
  }
}

async function healthRedis(req, res) {
  try {
    await initRedis();
    const pong = await redis.ping();
    res.json({ redis: pong === 'PONG' ? 'up' : 'down' });
  } catch (e) {
    res.status(500).json({ redis: 'down', error: e.message });
  }
}

module.exports = { health, healthDb, healthRedis };

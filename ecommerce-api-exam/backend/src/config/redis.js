const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: Number(process.env.REDIS_DB || 0),
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function initRedis() {
  if (!client.isOpen) await client.connect();
  return client;
}

module.exports = { client, initRedis };

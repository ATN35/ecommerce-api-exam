require('dotenv').config({ path: '/app/.env' });
const express = require('express');
const { security } = require('./middlewares/security');
const { notFound, errorHandler } = require('./middlewares/error');
const { initRedis } = require('./config/redis');
const { pool } = require('./config/db');

const app = express();
app.use(express.json());
security(app);

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/health', require('./routes/health'));
app.use('/api/rgpd', require('./routes/rgpd'));
app.use('/api/cookie', require('./routes/cookie'))
app.use('/api', require('./routes/admin'));

app.get('/', (_req, res) => res.json({ name: 'ecommerce-api', version: '1.0.0' }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;

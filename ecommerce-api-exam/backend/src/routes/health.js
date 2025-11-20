const express = require('express');
const { health, healthDb, healthRedis } = require('../controllers/healthController');
const router = express.Router();

router.get('/', health);
router.get('/db', healthDb);
router.get('/redis', healthRedis);

module.exports = router;

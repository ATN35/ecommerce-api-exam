const express = require('express');
const ctrl = require('../controllers/ordersController');
const { authRequired } = require('../middlewares/auth');
const router = express.Router();

router.post('/', authRequired, ctrl.create);

module.exports = router;

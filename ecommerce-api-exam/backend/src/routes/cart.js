const express = require('express');
const ctrl = require('../controllers/cartController');
const { authRequired } = require('../middlewares/auth');
const router = express.Router();

router.get('/', authRequired, ctrl.getCart);
router.post('/add', authRequired, ctrl.add);
router.put('/quantity', authRequired, ctrl.updateQty);
router.delete('/clear', authRequired, ctrl.clear);

module.exports = router;

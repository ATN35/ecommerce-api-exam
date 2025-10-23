const express = require('express');
const ctrl = require('../controllers/productsController');
const { authRequired, requireRole } = require('../middlewares/auth');
const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', authRequired, requireRole('admin'), ctrl.create);
router.put('/:id', authRequired, requireRole('admin'), ctrl.update);
router.delete('/:id', authRequired, requireRole('admin'), ctrl.remove);

module.exports = router;

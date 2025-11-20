const express = require('express');
const router = express.Router();

const { authRequired, requireRole } = require('../middlewares/auth');
const adminOrders = require('../controllers/adminOrdersController');
const adminUsers = require('../controllers/adminUsersController');

router.get('/admin/me', authRequired, requireRole('admin'), (req, res) => {
  res.json({
    id: req.user.sub,
    email: req.user.email,
    role: req.user.role,
  });
});

router.get(
  '/admin/orders',
  authRequired,
  requireRole('admin'),
  adminOrders.list
);

router.delete(
  '/admin/orders/:id',
  authRequired,
  requireRole('admin'),
  adminOrders.deleteOrder
);

router.delete(
  '/admin/users/:id',
  authRequired,
  requireRole('admin'),
  adminUsers.deleteUser
);

module.exports = router;

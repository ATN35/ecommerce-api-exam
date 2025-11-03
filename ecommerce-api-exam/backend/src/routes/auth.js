const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;

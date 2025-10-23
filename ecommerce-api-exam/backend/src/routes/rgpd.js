const express = require('express');
const { consent, deleteAccount } = require('../controllers/rgpdController');
const { authRequired } = require('../middlewares/auth');
const router = express.Router();

router.post('/consent', authRequired, consent);
router.delete('/account', authRequired, deleteAccount);

module.exports = router;

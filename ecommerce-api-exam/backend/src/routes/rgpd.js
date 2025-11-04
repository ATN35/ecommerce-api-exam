const express = require('express');
const router = express.Router();
const { authRequired } = require('../middlewares/auth');
const ctl = require('../controllers/rgpdController');

router.get('/consent', authRequired, ctl.getConsent);
router.post('/consent', authRequired, ctl.setConsent);
router.delete('/account', authRequired, ctl.deleteAccount);

module.exports = router;

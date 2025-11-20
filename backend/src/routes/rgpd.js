const express = require('express')
const router = express.Router()
const { authRequired } = require('../middlewares/auth')
const { setConsent, getConsent } = require('../controllers/rgpdController')

router.get('/consent', authRequired, getConsent)
router.post('/consent', authRequired, setConsent)

module.exports = router

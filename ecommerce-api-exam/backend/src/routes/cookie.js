const express = require('express')
const router = express.Router()
const { authRequired } = require('../middlewares/auth')
const ctrl = require('../controllers/cookieController')

router.delete('/delete-me', authRequired, ctrl.deleteMyAccount)

module.exports = router

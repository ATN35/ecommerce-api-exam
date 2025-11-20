const express = require('express')
const router = express.Router()
const { authRequired } = require('../middlewares/auth')
const { deleteMyAccount, logout } = require('../controllers/cookieController')

router.post('/logout', logout)
router.delete('/delete-me', authRequired, deleteMyAccount)

module.exports = router

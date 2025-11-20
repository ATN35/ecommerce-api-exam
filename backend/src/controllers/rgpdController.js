const { pool } = require('../config/db')

async function setConsent(req, res, next) {
  try {
    const { consent } = req.body
    if (typeof consent !== 'boolean') return res.status(400).json({ error: 'consent must be boolean' })
    await pool.query('UPDATE users SET cookie_consent=$1 WHERE id=$2', [consent, req.user.sub])
    return res.status(204).end()
  } catch (e) { next(e) }
}

async function getConsent(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT cookie_consent FROM users WHERE id=$1', [req.user.sub])
    if (!rows.length) return res.status(404).json({ error: 'user not found' })
    return res.json({ consent: rows[0].cookie_consent })
  } catch (e) { next(e) }
}

module.exports = { setConsent, getConsent }

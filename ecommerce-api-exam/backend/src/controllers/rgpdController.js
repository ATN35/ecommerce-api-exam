const Users = require('../models/users');

async function consent(req, res, next) {
  try {
    const { consent } = req.body; // true/false
    await Users.setCookieConsent(req.user.sub, Boolean(consent));
    res.status(204).end();
  } catch (e) { next(e); }
}

async function deleteAccount(req, res, next) {
  try {
    await Users.deleteUser(req.user.sub);
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { consent, deleteAccount };

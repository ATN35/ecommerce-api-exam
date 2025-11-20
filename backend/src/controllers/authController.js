const { pool } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const Users = require('../models/users');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });

    const exists = await Users.findByEmail(email);
    if (exists) return res.status(409).json({ error: 'email already in use' });

    const password_hash = await hashPassword(password);
    const user = await Users.createUser(email, password_hash, 'user');
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = signToken({ sub: user.id, email: user.email, role: user.role });

    if (req.query.cookie === '1') {
      res.cookie(process.env.COOKIE_NAME || 'token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 2,
      });
    }

    res.json({ token, role: user.role });
  } catch (e) { next(e); }
}

async function me(req, res) {
  res.json({ user: { id: req.user.sub, email: req.user.email, role: req.user.role } });
}

module.exports = { register, login, me };

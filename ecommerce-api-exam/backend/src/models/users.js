const { pool } = require('../config/db');

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  return rows[0] || null;
}

async function createUser(email, password_hash, role='user') {
  const { rows } = await pool.query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1,$2,$3) RETURNING id, email, role, created_at',
    [email, password_hash, role]
  );
  return rows[0];
}

async function setCookieConsent(userId, consent) {
  await pool.query('UPDATE users SET cookie_consent=$1, updated_at=NOW() WHERE id=$2', [consent, userId]);
}

async function deleteUser(userId) {
  await pool.query('DELETE FROM users WHERE id=$1', [userId]);
}

module.exports = { findByEmail, createUser, setCookieConsent, deleteUser };

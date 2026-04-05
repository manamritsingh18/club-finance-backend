const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async ({ name, email, password, role }) => {
  const existingUser = await db.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw { status: 409, message: 'Email already registered.' };
  }

  const password_hash = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, status, created_at`,
    [name, email, password_hash, role || 'viewer']
  );

  return result.rows[0];
};

const login = async ({ email, password }) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1 AND status = $2',
    [email, 'active']
  );

  if (result.rows.length === 0) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = { register, login };
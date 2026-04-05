const db = require('../../config/db');

const getAllUsers = async () => {
  const result = await db.query(
    'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

const getUserById = async (id) => {
  const result = await db.query(
    'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
    [id]
  );
  if (result.rows.length === 0) {
    throw { status: 404, message: 'User not found.' };
  }
  return result.rows[0];
};

const updateUser = async (id, { name, role, status }) => {
  const result = await db.query(
    `UPDATE users 
     SET name = COALESCE($1, name),
         role = COALESCE($2, role),
         status = COALESCE($3, status),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, role, status, updated_at`,
    [name, role, status, id]
  );
  if (result.rows.length === 0) {
    throw { status: 404, message: 'User not found.' };
  }
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await db.query(
    `UPDATE users SET status = 'inactive', updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, status`,
    [id]
  );
  if (result.rows.length === 0) {
    throw { status: 404, message: 'User not found.' };
  }
  return result.rows[0];
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
const db = require('../../config/db');

const createRecord = async (data, userId) => {
  const { amount, type, category, description, record_date, fund_source } = data;

  const result = await db.query(
    `INSERT INTO financial_records 
     (amount, type, category, description, record_date, fund_source, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [amount, type, category, description, record_date, fund_source, userId]
  );

  await db.query(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, changes)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, 'CREATE', 'financial_record', result.rows[0].id, JSON.stringify(result.rows[0])]
  );

  return result.rows[0];
};

const getAllRecords = async (filters) => {
  const { type, category, start_date, end_date, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;
  const conditions = ['is_deleted = FALSE'];
  const values = [];
  let i = 1;

  if (type) {
    conditions.push(`type = $${i++}`);
    values.push(type);
  }
  if (category) {
    conditions.push(`category ILIKE $${i++}`);
    values.push(`%${category}%`);
  }
  if (start_date) {
    conditions.push(`record_date >= $${i++}`);
    values.push(start_date);
  }
  if (end_date) {
    conditions.push(`record_date <= $${i++}`);
    values.push(end_date);
  }

  const where = conditions.join(' AND ');

  const countResult = await db.query(
    `SELECT COUNT(*) FROM financial_records WHERE ${where}`,
    values
  );

  values.push(limit, offset);
  const result = await db.query(
    `SELECT * FROM financial_records 
     WHERE ${where} 
     ORDER BY record_date DESC 
     LIMIT $${i++} OFFSET $${i++}`,
    values
  );

  return {
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    records: result.rows,
  };
};

const getRecordById = async (id) => {
  const result = await db.query(
    'SELECT * FROM financial_records WHERE id = $1 AND is_deleted = FALSE',
    [id]
  );
  if (result.rows.length === 0) {
    throw { status: 404, message: 'Record not found.' };
  }
  return result.rows[0];
};

const updateRecord = async (id, data, userId) => {
  const { amount, type, category, description, record_date, fund_source } = data;

  const old = await getRecordById(id);

  const result = await db.query(
    `UPDATE financial_records
     SET amount = COALESCE($1, amount),
         type = COALESCE($2, type),
         category = COALESCE($3, category),
         description = COALESCE($4, description),
         record_date = COALESCE($5, record_date),
         fund_source = COALESCE($6, fund_source),
         updated_by = $7,
         updated_at = NOW()
     WHERE id = $8 AND is_deleted = FALSE
     RETURNING *`,
    [amount, type, category, description, record_date, fund_source, userId, id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: 'Record not found.' };
  }

  await db.query(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, changes)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, 'UPDATE', 'financial_record', id,
      JSON.stringify({ before: old, after: result.rows[0] })]
  );

  return result.rows[0];
};

const deleteRecord = async (id, userId) => {
  const result = await db.query(
    `UPDATE financial_records
     SET is_deleted = TRUE, updated_by = $1, updated_at = NOW()
     WHERE id = $2 AND is_deleted = FALSE
     RETURNING *`,
    [userId, id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: 'Record not found.' };
  }

  await db.query(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, changes)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, 'DELETE', 'financial_record', id, JSON.stringify(result.rows[0])]
  );

  return result.rows[0];
};

module.exports = { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord };
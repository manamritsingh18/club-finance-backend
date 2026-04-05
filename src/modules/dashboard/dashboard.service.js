const db = require('../../config/db');

const getSummary = async () => {
  const result = await db.query(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net_balance,
      COUNT(*) AS total_records
    FROM financial_records
    WHERE is_deleted = FALSE
  `);
  return result.rows[0];
};

const getCategoryTotals = async () => {
  const result = await db.query(`
    SELECT
      category,
      type,
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*) AS count
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY category, type
    ORDER BY total DESC
  `);
  return result.rows;
};

const getMonthlyTrends = async () => {
  const result = await db.query(`
    SELECT
      TO_CHAR(record_date, 'YYYY-MM') AS month,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `);
  return result.rows;
};

const getRecentActivity = async () => {
  const result = await db.query(`
    SELECT
      fr.*,
      u.name AS created_by_name
    FROM financial_records fr
    LEFT JOIN users u ON fr.created_by = u.id
    WHERE fr.is_deleted = FALSE
    ORDER BY fr.created_at DESC
    LIMIT 10
  `);
  return result.rows;
};

const getFundSourceRankings = async () => {
  const result = await db.query(`
    SELECT
      fund_source,
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*) AS count
    FROM financial_records
    WHERE is_deleted = FALSE
      AND fund_source IS NOT NULL
    GROUP BY fund_source
    ORDER BY total DESC
  `);
  return result.rows;
};

const getWeeklyTrends = async () => {
  const result = await db.query(`
    SELECT
      TO_CHAR(record_date, 'IYYY-IW') AS week,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net
    FROM financial_records
    WHERE is_deleted = FALSE
    GROUP BY week
    ORDER BY week DESC
    LIMIT 8
  `);
  return result.rows;
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getFundSourceRankings,
  getWeeklyTrends,
};
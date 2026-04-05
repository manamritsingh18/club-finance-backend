const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const rbac = require('../../middleware/rbac');
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getFundSourceRankings,
  getWeeklyTrends,
} = require('./dashboard.controller');

router.use(auth);

// Analyst and above can access dashboard
router.get('/summary', rbac('analyst'), getSummary);
router.get('/categories', rbac('analyst'), getCategoryTotals);
router.get('/trends/monthly', rbac('analyst'), getMonthlyTrends);
router.get('/trends/weekly', rbac('analyst'), getWeeklyTrends);
router.get('/recent', rbac('analyst'), getRecentActivity);
router.get('/fund-sources', rbac('analyst'), getFundSourceRankings);

module.exports = router;
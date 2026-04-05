const dashboardService = require('./dashboard.service');

const getSummary = async (req, res) => {
  try {
    const data = await dashboardService.getSummary();
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getCategoryTotals = async (req, res) => {
  try {
    const data = await dashboardService.getCategoryTotals();
    res.status(200).json({ categories: data });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const data = await dashboardService.getMonthlyTrends();
    res.status(200).json({ monthly_trends: data });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const data = await dashboardService.getRecentActivity();
    res.status(200).json({ recent_activity: data });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getFundSourceRankings = async (req, res) => {
  try {
    const data = await dashboardService.getFundSourceRankings();
    res.status(200).json({ fund_sources: data });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getWeeklyTrends = async (req, res) => {
  try {
    const data = await dashboardService.getWeeklyTrends();
    res.status(200).json({ weekly_trends: data });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getFundSourceRankings,
  getWeeklyTrends,
};
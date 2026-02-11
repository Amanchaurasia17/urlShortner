const express = require('express');
const router = express.Router();
const {
  getUrlAnalytics,
  getOverallStats
} = require('../controllers/analytics.controller');

// GET /api/analytics/stats - Overall statistics
router.get('/stats', getOverallStats);

// GET /api/analytics/:shortCode - Get analytics for specific URL
router.get('/:shortCode', getUrlAnalytics);

module.exports = router;

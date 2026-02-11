const Analytics = require('../models/Analytics.model');
const Url = require('../models/Url.model');
const { cacheGet, cacheSet } = require('../config/redis');

// Get analytics for a specific URL
const getUrlAnalytics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const { days = 7 } = req.query;

    // Check cache
    const cacheKey = `analytics:${shortCode}:${days}`;
    const cached = await cacheGet(cacheKey);
    
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true
      });
    }

    // Find URL
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ 
        success: false, 
        message: 'URL not found' 
      });
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Aggregate analytics
    const analytics = await Analytics.find({
      urlId: url._id,
      timestamp: { $gte: startDate }
    });

    // Process analytics data
    const clicksByDate = {};
    const browsers = {};
    const os = {};
    const devices = {};
    const countries = {};
    const referrers = {};

    analytics.forEach(record => {
      // Clicks by date
      const date = record.timestamp.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;

      // Browsers
      if (record.visitor.browser) {
        browsers[record.visitor.browser] = (browsers[record.visitor.browser] || 0) + 1;
      }

      // Operating systems
      if (record.visitor.os) {
        os[record.visitor.os] = (os[record.visitor.os] || 0) + 1;
      }

      // Devices
      if (record.visitor.device) {
        devices[record.visitor.device] = (devices[record.visitor.device] || 0) + 1;
      }

      // Countries
      if (record.visitor.country) {
        countries[record.visitor.country] = (countries[record.visitor.country] || 0) + 1;
      }

      // Referrers
      if (record.referrer && record.referrer !== 'direct') {
        referrers[record.referrer] = (referrers[record.referrer] || 0) + 1;
      }
    });

    const analyticsData = {
      totalClicks: url.clicks,
      clicksInPeriod: analytics.length,
      clicksByDate: Object.entries(clicksByDate).map(([date, clicks]) => ({ date, clicks })),
      browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })),
      operatingSystems: Object.entries(os).map(([name, count]) => ({ name, count })),
      devices: Object.entries(devices).map(([name, count]) => ({ name, count })),
      countries: Object.entries(countries).map(([name, count]) => ({ name, count })),
      referrers: Object.entries(referrers).map(([source, count]) => ({ source, count })),
      url: {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        createdAt: url.createdAt
      }
    };

    // Cache results for 5 minutes
    await cacheSet(cacheKey, JSON.stringify(analyticsData), 300);

    res.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    next(error);
  }
};

// Get overall statistics
const getOverallStats = async (req, res, next) => {
  try {
    const cacheKey = 'stats:overall';
    const cached = await cacheGet(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true
      });
    }

    const totalUrls = await Url.countDocuments({ isActive: true });
    const totalClicks = await Url.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);

    const topUrls = await Url.find({ isActive: true })
      .sort({ clicks: -1 })
      .limit(10)
      .select('shortCode originalUrl clicks createdAt');

    const recentUrls = await Url.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('shortCode originalUrl clicks createdAt');

    // Analytics for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAnalytics = await Analytics.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      totalUrls,
      totalClicks: totalClicks[0]?.total || 0,
      topUrls,
      recentUrls,
      clicksByDay: recentAnalytics.map(item => ({
        date: item._id,
        clicks: item.clicks
      }))
    };

    // Cache for 5 minutes
    await cacheSet(cacheKey, JSON.stringify(stats), 300);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUrlAnalytics,
  getOverallStats
};

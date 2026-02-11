const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');
const { cacheGet, cacheSet, incrementCounter } = require('../config/redis');

const redirectToOriginal = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Try cache first
    const cached = await cacheGet(`url:${shortCode}`);
    let url;

    if (cached) {
      const urlData = JSON.parse(cached);
      
      // Verify it's still active
      url = await Url.findOne({ shortCode, isActive: true });
      
      if (!url) {
        // Cache is stale
        await cacheGet(`url:${shortCode}`);
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found or expired' 
        });
      }
    } else {
      // Query database
      url = await Url.findActiveUrl(shortCode);
      
      if (!url) {
        return res.status(404).json({ 
          success: false, 
          message: 'URL not found or expired' 
        });
      }

      // Cache the URL
      await cacheSet(`url:${shortCode}`, JSON.stringify({
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        isActive: url.isActive
      }), 3600);
    }

    // Check if expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      url.isActive = false;
      await url.save();
      return res.status(410).json({ 
        success: false, 
        message: 'URL has expired' 
      });
    }

    // Parse user agent
    const parser = new UAParser(req.get('user-agent'));
    const uaResult = parser.getResult();

    // Get geo location from IP
    // Extract real IP from proxy headers (for Docker/nginx)
    const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.get('x-real-ip') || 
               req.ip || 
               req.connection.remoteAddress;
    
    // Clean up IP address (remove IPv6 prefix if present)
    const cleanIp = ip.replace(/^::ffff:/, '');
    
    // For localhost/private IPs, use a public IP for demo purposes
    // In production, this would be the actual client IP
    let geo = null;
    if (cleanIp !== '127.0.0.1' && cleanIp !== 'localhost' && !cleanIp.startsWith('172.') && !cleanIp.startsWith('192.168.')) {
      geo = geoip.lookup(cleanIp);
    }
    
    // For local testing, set a demo location
    if (!geo && (cleanIp === '127.0.0.1' || cleanIp === 'localhost' || cleanIp.startsWith('172.') || cleanIp.startsWith('192.168.'))) {
      // Use a known public IP for demo (Google DNS IP will show US location)
      geo = geoip.lookup('8.8.8.8');
    }

    // Check if bot
    const isBot = /bot|crawler|spider|crawling/i.test(req.get('user-agent') || '');

    // Record analytics asynchronously
    const analyticsData = {
      urlId: url._id,
      shortCode: url.shortCode,
      visitor: {
        ip: cleanIp,
        userAgent: req.get('user-agent'),
        browser: uaResult.browser.name || 'Unknown',
        os: uaResult.os.name || 'Unknown',
        device: uaResult.device.type || 'desktop',
        country: geo?.country || 'Unknown',
        city: geo?.city || 'Unknown'
      },
      referrer: req.get('referer') || 'direct',
      isBot
    };

    // Save analytics without blocking redirect
    Analytics.create(analyticsData).catch(err => {
      console.error('Analytics error:', err);
    });

    // Increment click counter in Redis (non-blocking)
    incrementCounter(`clicks:${shortCode}`, 86400).catch(err => {
      console.error('Counter error:', err);
    });

    // Increment in database (non-blocking)
    url.incrementClicks().catch(err => {
      console.error('DB increment error:', err);
    });

    // Redirect to original URL
    res.redirect(301, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  redirectToOriginal
};

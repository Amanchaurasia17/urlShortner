const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const QRCode = require('qrcode');
const Url = require('../models/Url.model');
const { cacheGet, cacheSet, cacheDelete } = require('../config/redis');

// Generate short URL
const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresIn, tags } = req.body;

    // Validate URL
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid URL format' 
      });
    }

    // Check if custom alias is already taken
    if (customAlias) {
      const existing = await Url.findOne({ customAlias });
      if (existing) {
        return res.status(409).json({ 
          success: false, 
          message: 'Custom alias already taken' 
        });
      }
    }

    // Generate short code
    const shortCode = customAlias || nanoid(7);

    // Calculate expiry date
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);
    }

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`
    );

    // Create URL document
    const url = new Url({
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      qrCode: qrCodeUrl,
      expiresAt,
      tags: tags || [],
      creator: {
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    await url.save();

    // Cache the URL
    await cacheSet(`url:${shortCode}`, JSON.stringify({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      isActive: url.isActive
    }), 3600);

    res.status(201).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        shortCode: url.shortCode,
        qrCode: url.qrCode,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get URL details
const getUrlDetails = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Try cache first
    const cached = await cacheGet(`url:${shortCode}`);
    if (cached) {
      const urlData = JSON.parse(cached);
      const url = await Url.findOne({ shortCode });
      if (url) {
        return res.json({
          success: true,
          data: url
        });
      }
    }

    // Query database
    const url = await Url.findActiveUrl(shortCode);
    
    if (!url) {
      return res.status(404).json({ 
        success: false, 
        message: 'URL not found' 
      });
    }

    // Update cache
    await cacheSet(`url:${shortCode}`, JSON.stringify({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      isActive: url.isActive
    }), 3600);

    res.json({
      success: true,
      data: url
    });
  } catch (error) {
    next(error);
  }
};

// Get all URLs (with pagination)
const getAllUrls = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const urls = await Url.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Url.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        urls,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete URL
const deleteUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return res.status(404).json({ 
        success: false, 
        message: 'URL not found' 
      });
    }

    // Soft delete
    url.isActive = false;
    await url.save();

    // Remove from cache
    await cacheDelete(`url:${shortCode}`);

    res.json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update URL
const updateUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const { tags, expiresIn } = req.body;

    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return res.status(404).json({ 
        success: false, 
        message: 'URL not found' 
      });
    }

    if (tags) url.tags = tags;
    if (expiresIn) {
      url.expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);
    }

    await url.save();

    // Update cache
    await cacheDelete(`url:${shortCode}`);

    res.json({
      success: true,
      data: url
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  shortenUrl,
  getUrlDetails,
  getAllUrls,
  deleteUrl,
  updateUrl
};

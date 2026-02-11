const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    index: true
  },
  shortCode: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  visitor: {
    ip: String,
    userAgent: String,
    browser: String,
    os: String,
    device: String,
    country: String,
    city: String
  },
  referrer: String,
  isBot: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes for analytics queries
analyticsSchema.index({ urlId: 1, timestamp: -1 });
analyticsSchema.index({ shortCode: 1, timestamp: -1 });

// TTL index - automatically delete old analytics after 90 days
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('Analytics', analyticsSchema);

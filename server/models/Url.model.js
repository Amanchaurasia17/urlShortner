const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customAlias: {
    type: String,
    sparse: true,
    unique: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  metadata: {
    title: String,
    description: String,
    favicon: String
  },
  qrCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    index: true
  },
  creator: {
    ip: String,
    userAgent: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Compound index for efficient queries
urlSchema.index({ createdAt: -1, clicks: -1 });
urlSchema.index({ shortCode: 1, isActive: 1 });

// Virtual for full short URL
urlSchema.virtual('shortUrl').get(function() {
  return `${process.env.BASE_URL || 'http://localhost:3000'}/${this.shortCode}`;
});

// Method to increment clicks
urlSchema.methods.incrementClicks = async function() {
  this.clicks += 1;
  return this.save();
};

// Static method to find active URL
urlSchema.statics.findActiveUrl = function(shortCode) {
  return this.findOne({ shortCode, isActive: true });
};

urlSchema.set('toJSON', { virtuals: true });
urlSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Url', urlSchema);

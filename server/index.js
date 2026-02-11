const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const urlRoutes = require('./routes/url.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const redirectRoute = require('./routes/redirect.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { connectRedis } = require('./config/redis');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());

// CORS configuration
app.use(cors({
  origin: process.env.BASE_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/', redirectRoute);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Connect Redis
    connectRedis()
      .then(() => {
        console.log('✅ Redis connected successfully');
        
        // Start server
        app.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT}`);
          console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
      })
      .catch((err) => {
        console.error('❌ Redis connection failed:', err.message);
        console.log('⚠️  Server starting without Redis (caching disabled)');
        
        app.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT} (Redis disabled)`);
        });
      });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;

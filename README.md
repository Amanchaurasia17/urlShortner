# URL Shortener Pro 🚀

A feature-rich, enterprise-grade URL shortener built with the MERN stack (MongoDB, Express, React, Node.js), Redis caching, and comprehensive analytics with production-ready code, scalable architecture, and modern best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### Core Functionality
- 🔗 **URL Shortening** - Generate short, memorable URLs instantly
- 🎯 **Custom Aliases** - Create branded, custom short links
- ⏰ **Link Expiration** - Set automatic expiration dates for temporary links
- 📱 **QR Code Generation** - Automatic QR code creation for each short URL
- 🏷️ **URL Tagging** - Organize URLs with custom tags

### Analytics & Tracking
- 📊 **Comprehensive Analytics** - Detailed click tracking and statistics
- 🌍 **Geographic Data** - Track visitor locations by country and city
- 🖥️ **Device Information** - Monitor desktop, mobile, and tablet usage
- 🌐 **Browser & OS Stats** - Track user agents and operating systems
- 🔗 **Referrer Tracking** - See where your traffic is coming from
- 📈 **Time-Series Data** - Visualize clicks over time with interactive charts

### Performance & Security
- ⚡ **Redis Caching** - Lightning-fast redirects with intelligent caching
- 🛡️ **Rate Limiting** - Prevent abuse with configurable rate limits
- 🔒 **Input Validation** - Comprehensive validation using Joi
- 🔐 **Helmet Security** - HTTP header security best practices
- 🗜️ **Compression** - Gzip compression for optimal performance
- 🚫 **XSS Protection** - MongoDB sanitization to prevent injection attacks

### User Experience
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌓 **Dark Mode** - Full dark mode support
- ✨ **Animations** - Smooth animations with Framer Motion
- 📱 **Mobile Responsive** - Optimized for all screen sizes
- 🔔 **Toast Notifications** - Real-time feedback with React Hot Toast

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client    │────▶│   Express    │────▶│   MongoDB    │
│   (React)   │     │   Server     │     │  (Database)  │
└─────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Redis     │
                    │   (Cache)    │
                    └──────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Framer Motion for animations
- Axios for API requests

**Backend:**
- Node.js & Express
- MongoDB with Mongoose ODM
- Redis for caching and counters
- Rate limiting with express-rate-limit
- Input validation with Joi
- QR code generation with qrcode
- User agent parsing & geolocation

**DevOps:**
- Docker & Docker Compose
- Nginx for reverse proxy
- Environment-based configuration

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- Redis (local or Cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd url
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**

Create `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB (use MongoDB Atlas for free cloud hosting)
MONGODB_URI=mongodb://localhost:27017/url-shortener

# Redis (use Redis Cloud for free cloud hosting)
REDIS_URL=redis://localhost:6379

# Application
BASE_URL=http://localhost:3000
API_URL=http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start development servers**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

## ☁️ Free Cloud Deployment

### Option 1: Railway (Recommended)

**Backend:**
1. Push code to GitHub
2. Visit [Railway](https://railway.app)
3. Create new project from GitHub repo
4. Add MongoDB and Redis plugins
5. Set environment variables
6. Deploy!

**Frontend:**
1. Visit [Vercel](https://vercel.com)
2. Import GitHub repository
3. Set build settings for `/client` directory
4. Add environment variables
5. Deploy!

### Option 2: Render

**Backend:**
1. Visit [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && node index.js`
6. Add environment variables
7. Deploy!

**Frontend:**
1. Create Static Site on Render
2. Build command: `cd client && npm install && npm run build`
3. Publish directory: `client/build`
4. Deploy!

### Free Cloud Services

**MongoDB:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - 512MB free tier

**Redis:**
- [Redis Cloud](https://redis.com/try-free/) - 30MB free tier
- [Upstash](https://upstash.com/) - 10,000 commands/day free

## 📁 Project Structure

```
url/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── docker-compose.yml    # Docker orchestration
├── .env.example         # Environment template
└── README.md
```

## 🔌 API Endpoints

### URL Management
```
POST   /api/url/shorten          # Create short URL
GET    /api/url/:shortCode       # Get URL details
GET    /api/url                  # Get all URLs (paginated)
PUT    /api/url/:shortCode       # Update URL
DELETE /api/url/:shortCode       # Delete URL
```

### Analytics
```
GET    /api/analytics/:shortCode # Get URL analytics
GET    /api/analytics/stats      # Get overall statistics
```

### Redirect
```
GET    /:shortCode              # Redirect to original URL
```

### Example Request
```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "customAlias": "my-link",
    "expiresIn": 30,
    "tags": ["marketing", "campaign"]
  }'
```

## 🎨 UI Screenshots

### Home Page
- Clean, modern interface
- URL shortening form
- Advanced options (custom alias, expiration, tags)
- Real-time QR code generation

### Dashboard
- All shortened URLs in one place
- Click statistics
- Quick actions (view analytics, delete)
- Pagination support

### Analytics
- Interactive charts and graphs
- Time-series data visualization
- Geographic distribution
- Device and browser breakdown
- Referrer tracking

## 🔧 Configuration

### Rate Limiting
Adjust in `.env`:
```env
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # 100 requests per window
```

### Cache TTL
Configure in `server/config/redis.js`:
```javascript
const CACHE_TTL = 3600;  // 1 hour
```

### URL Expiration
Set maximum expiration (days) in validation schema:
```javascript
expiresIn: Joi.number().integer().min(1).max(365)
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📊 Performance Optimization

- **Redis Caching**: Frequently accessed URLs cached for instant retrieval
- **Database Indexing**: Optimized indexes on shortCode, createdAt, and clicks
- **Compression**: Gzip compression for all responses
- **Connection Pooling**: Efficient MongoDB connection management
- **Lazy Loading**: Code splitting for faster initial load
- **CDN Ready**: Static assets optimized for CDN delivery

## 🔒 Security Features

- Helmet.js for HTTP header security
- Rate limiting to prevent abuse
- MongoDB injection prevention
- CORS configuration
- Input validation and sanitization
- Environment variable protection

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener
```

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping

# Or use Redis Cloud connection string
REDIS_URL=redis://default:password@redis-server:port
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

## 📈 Scaling Considerations

- **Horizontal Scaling**: Stateless design allows multiple server instances
- **Database Sharding**: MongoDB supports sharding for high-volume applications
- **Redis Clustering**: Scale Redis for high-traffic scenarios
- **CDN Integration**: Serve static assets via CDN
- **Load Balancing**: Use nginx or cloud load balancers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🌟 Key Highlights for Recruiters

### System Design
- **Scalable Architecture**: Microservices-ready design with clear separation of concerns
- **Caching Strategy**: Multi-layer caching with Redis for optimal performance
- **Database Design**: Efficient schema with proper indexing and TTL indexes

### Code Quality
- **Clean Code**: Following SOLID principles and best practices
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: Input validation at multiple layers
- **Documentation**: Well-documented code and API

### DevOps
- **Containerization**: Docker and Docker Compose setup
- **CI/CD Ready**: Prepared for automated deployment pipelines
- **Environment Management**: Proper configuration management
- **Monitoring**: Health check endpoints for uptime monitoring

### Features
- **Production-Ready**: Rate limiting, security headers, compression
- **Analytics**: Comprehensive tracking and visualization
- **UX**: Modern, responsive UI with excellent user experience
- **Performance**: Optimized for speed with caching and indexing

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using MERN Stack, Redis, and modern web technologies

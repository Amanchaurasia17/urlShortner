const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error('Redis reconnection failed');
          }
          return retries * 1000;
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
};

const getRedisClient = () => redisClient;

const cacheGet = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

const cacheSet = async (key, value, ttl = 3600) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.setEx(key, ttl, value);
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

const cacheDelete = async (key) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

const incrementCounter = async (key, ttl = 86400) => {
  if (!redisClient || !redisClient.isOpen) return null;
  try {
    const count = await redisClient.incr(key);
    if (count === 1) {
      await redisClient.expire(key, ttl);
    }
    return count;
  } catch (error) {
    console.error('Counter increment error:', error);
    return null;
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDelete,
  incrementCounter
};

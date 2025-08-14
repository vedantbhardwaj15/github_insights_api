// src/middleware/rateLimiter.js
const { getRedisClient } = require("../config/redis");

const WINDOW_SIZE = parseInt(process.env.RATE_LIMIT_WINDOW) || 60; // seconds
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX) || 30;

async function rateLimiter(req, res, next) {
  try {
    const client = getRedisClient();
    const ip = req.ip || req.connection.remoteAddress;
    const key = `ratelimit:${ip}`;

    const requests = await client.incr(key);

    if (requests === 1) {
      await client.expire(key, WINDOW_SIZE);
    }

    if (requests > MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests. Please try again later."
      });
    }

    next();
  } catch (err) {
    console.error("❌ Rate limiter error:", err.message);
    next(); // fail open
  }
}

module.exports = rateLimiter;

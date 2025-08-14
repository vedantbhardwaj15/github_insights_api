// config/redis.js
const Redis = require("ioredis");

let redisClient;

function initRedis() {
  if (redisClient) return redisClient;
  if (!process.env.UPSTASH_REDIS_URL) {
    throw new Error("❌ UPSTASH_REDIS_URL is not set in environment variables.");
  }

  // ioredis automatically handles TLS if rediss:// is used
  redisClient = new Redis(process.env.UPSTASH_REDIS_URL, {
    tls: {}, // keep empty for Upstash, they have proper certs
  });

  redisClient.on("connect", () => {
    console.log("✅ Connected to Upstash Redis");
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
  });

  return redisClient;
}

function getRedisClient() {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call initRedis() first.");
  }
  return redisClient;
}

module.exports = { initRedis, getRedisClient };

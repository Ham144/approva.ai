import Redis from "ioredis";
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

const redisService = {
  get: async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  set: async (key, value, ttl = 600) => {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  },

  // Menghapus cache berdasarkan pola (pattern)
  // Sangat berguna untuk invalidate semua cache milik satu Org
  deleteByPattern: async (pattern) => {
    const stream = redis.scanStream({ match: pattern });
    stream.on("data", (keys) => {
      if (keys.length) redis.del(keys);
    });
  },
};

export default redisService;

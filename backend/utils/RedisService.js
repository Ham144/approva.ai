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
    return new Promise((resolve, reject) => {
      const stream = redis.scanStream({ match: pattern });
      const pipeline = redis.pipeline();
      let count = 0;

      stream.on("data", (keys) => {
        if (keys.length) {
          keys.forEach((key) => {
            pipeline.del(key);
            count++;
          });
        }
      });

      stream.on("end", async () => {
        try {
          if (count > 0) {
            await pipeline.exec();
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      stream.on("error", (err) => {
        reject(err);
      });
    });
  },
};

export default redisService;

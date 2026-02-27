import redisService from "../utils/RedisService.js";

const flowCacheMiddleware = async (req, res, next) => {
  const { org, _id: userId } = req.user;
  const { instanceId } = req.params;
  const queryStr = JSON.stringify(req.query);

  const cacheKey = `flow:${org}:${userId}:${instanceId || "list"}:${queryStr}`;
  req.cacheKey = cacheKey;

  try {
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      // 1. Tanda di Console Server
      console.log(`\x1b[32m[REDIS]\x1b[0m HIT - Key: ${cacheKey}`);

      // 2. Tanda di Response Header (Bisa dilihat di Postman/Browser)
      res.set("X-Cache", "HIT");
      return res.json(cachedData);
    }

    // Jika tidak ada di cache
    console.log(`\x1b[31m[REDIS]\x1b[0m MISS - Key: ${cacheKey}`);
    res.set("X-Cache", "MISS");
    next();
  } catch (error) {
    console.error("Redis Error:", error);
    next();
  }
};
export default flowCacheMiddleware;

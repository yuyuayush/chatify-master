import redisClient from "../config/redis.js";

const redisHandler = {

  async get(key) {
    try {
      const data = await redisClient.get(key);
      console.log(`Redis GET for key "${key}":`);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error(`Redis GET Error for key "${key}":`, error);
      return null;
    }
  },

  async set(key, value, ttl = null) {
    try {
      const jsonValue = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, jsonValue);
      } else {
        await redisClient.set(key, jsonValue);
      }
    } catch (error) {
      console.error(`❌ Redis SET Error for key "${key}":`, error);
    }
  },


  async del(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(` Redis DEL Error for key "${key}":`, error);
    }
  },


  async exists(key) {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS Error for key "${key}":`, error);
      return false;
    }
  },
};

export default redisHandler;

import { createClient } from "redis";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USERNAME } = process.env;

const redisClient = createClient({
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("🔌 Connecting to Redis..."));
redisClient.on("ready", () => console.log("✅ Redis connected successfully!"));

// Wrap connection in async function
export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Redis connection error:", err);
  }
}

// Call immediately
connectRedis();

export default redisClient;

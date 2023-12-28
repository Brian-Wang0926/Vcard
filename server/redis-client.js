require("dotenv").config();
const { createClient } = require("redis");

console.log(
  "Redis URL:",
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.on("error", (err) => console.log("Redis Client Error", err));

// 確保客戶端連接成功後再導出
client.connect().catch((err) => console.error("Redis連接錯誤:", err));

module.exports = client;

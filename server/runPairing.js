// runPairing.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cardController = require('./controllers/card-controller');

const mongooseUri = process.env.MONGODB_URI;

async function runPairingProcess() {
  try {
    await mongoose.connect(mongooseUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("数据库连接成功");

    // 运行配对过程
    await cardController.checkEligibility();
    await cardController.pairUsers();
    await cardController.clearExpiredPairs();

    console.log("配对过程完成");
  } catch (error) {
    console.error("配对过程中出错:", error);
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

runPairingProcess();

// runPairing.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cardController = require('./controllers/card-controller');

const mongooseUri = process.env.MONGODB_URI;

async function runPairingProcess() {
  try {
    await mongoose.connect(mongooseUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("數據庫連接");

    // 运行配对过程
    await cardController.checkEligibility();
    await cardController.pairUsers();
    await cardController.clearExpiredPairs();

    console.log("配對完成");
  } catch (error) {
    console.error("配對出错:", error);
  } finally {
    await mongoose.disconnect();
    console.log("數據庫已關閉");
  }
}

runPairingProcess();

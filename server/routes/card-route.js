const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const cardController = require("../controllers/card-controller");
const { authMiddleware } = require("../controllers/auth-controller");

// 在每天11:59執行更新抽卡資格並抽卡
cron.schedule("59 23 * * *", () => {
  cardController
    .checkEligibility()
    .then(() => {
      cardController.pairUsers();
    })
    .then(() => {
      cardController.clearExpiredPairs(); // 新增
    })
    .catch((error) => {
      console.error("Error during cron job:", error);
    });
});

router.get("/getPairs", authMiddleware, cardController.getPairs);

router.post("/accept", authMiddleware, cardController.agreePairs);

module.exports = router;

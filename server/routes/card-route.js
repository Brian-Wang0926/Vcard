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
    .catch((error) => {
      console.error("Error during cron job:", error);
    });
});

//先根據每個人的最後登入時間，找出低於三天的獲得抽卡資格
// router.get("/checkEligibility", cardController.checkEligibility);
// // 找出所有有資格抽卡的，進行抽卡
// router.get("/pairUsers", cardController.pairUsers);

router.get("/getPairs", authMiddleware, cardController.getPairs);

router.post("/accept", authMiddleware, cardController.agreePairs);

module.exports = router;

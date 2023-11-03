const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const cardController = require("../controllers/card-controller");
const { authMiddleware } = require("../controllers/auth-controller");

// 在每天11:59執行抽卡
cron.schedule("59 23 * * *", cardController.pairUsers);

router.get(
  "/checkEligibility",
  authMiddleware,
  cardController.checkEligibility
);

router.get("/pairUsers", cardController.pairUsers);

router.get("/getPairs", authMiddleware, cardController.getPairs);

router.post("/accept", authMiddleware, cardController.agreePairs);

module.exports = router;

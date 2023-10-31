const express = require("express");
const router = express.Router();
const cron = require('node-cron');
const cardController = require("../controllers/card-controller");

// 在每天11:59執行抽卡
// cron.schedule('59 23 * * *', cardController.pairUsers);

router.get('/checkEligibility/:userId', cardController.checkEligibility);

router.get('/pairUsers', cardController.pairUsers);

router.get('/getPairs/:userId', cardController.getPairs);

router.post('/accept', cardController.agreePairs);
  
module.exports = router;

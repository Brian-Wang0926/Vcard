const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile-controller");
const { authMiddleware } = require("../controllers/auth-controller");

router.get("/", authMiddleware, profileController.getUserProfile);

router.put("/save-article", authMiddleware, profileController.saveArticle);

router.get("/save-article", authMiddleware, profileController.getSaveArticle);

router.post("/subscribe", authMiddleware, profileController.subscribeBoard);

router.get("/subscribe", authMiddleware, profileController.getSubscribedBoards);

module.exports = router;

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat-controller");
const { authMiddleware } = require("../controllers/auth-controller");

router.get("/friends", authMiddleware, chatController.getAllFriends);

router.get("/:friendId", authMiddleware, chatController.getChatWithFriend);

// router.post("/send", authMiddleware, chatController.sendMessage);

module.exports = router;

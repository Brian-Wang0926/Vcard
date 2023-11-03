const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile-controller");
const { authMiddleware } = require("../controllers/auth-controller");

router.get("/", authMiddleware, profileController.getUserProfile);

module.exports = router;
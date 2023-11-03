const User = require("../models/user-model");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "找不到使用者！" });
      return;
    }

    res.status(200).json(user);
  } catch (e) {
    console.error("Error during checking:", e);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getUserProfile };

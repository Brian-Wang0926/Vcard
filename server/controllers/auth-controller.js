const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const googleCallback = (req, res) => {
  const { user } = req;
  const tokenObj = { _id: user.id, email: user.email, name: user.name };
  const token = jwt.sign(tokenObj, process.env.JWT_SECRET);

  res.redirect(
    `http://localhost:3000?token=JWT ${token}&name=${user.name}&id=${user.id}`
  );
};

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken._id;
    next();
  } catch (error) {
    res.status(401).json({ message: "身份驗證失敗！" });
  }
};

// 模擬使用者登入
const mockLogin = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "模擬使用者未找到" });
    }
    const tokenObj = { _id: user._id, email: user.email, name: user.name };
    const token = jwt.sign(tokenObj, process.env.JWT_SECRET);
    res.json({ token, name: user.name, id: user._id });
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

module.exports = {
  googleCallback,
  authMiddleware,
  mockLogin,
};

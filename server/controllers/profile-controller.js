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

const saveArticle = async (req, res) => {
  console.log("文章收藏後端接收資料");
  const userId = req.userId;
  const { articleId } = req.body;
  const user = await User.findById(userId);
  console.log("文章收藏後端接收資料", userId, articleId);
  try {
    if (user.savedArticles.includes(articleId)) {
      user.savedArticles.pull(articleId);
      console.log("後端成功取消儲存文章");
    } else {
      user.savedArticles.push(articleId);
      console.log("後端成功儲存文章");
    }
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "儲存文章時發生錯誤" });
  }
};

const getSaveArticle = async (req, res) => {
  try {
    console.log("後端取得收藏文章");
    const userId = req.userId; // 或從JWT獲取用戶ID
    const user = await User.findById(userId).populate("savedArticles");
    if (!user) {
      return res.status(404).send({ message: "用戶未找到" });
    }
    res.status(200).send({ savedArticles: user.savedArticles });
  } catch (error) {
    res.status(500).send({ message: "獲取收藏文章時發生錯誤" });
  }
};

module.exports = { getUserProfile, saveArticle, getSaveArticle};

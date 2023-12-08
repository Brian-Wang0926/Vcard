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
      console.log("後端成功取消收藏文章", articleId);
    } else {
      user.savedArticles.push(articleId);
      console.log("後端成功收藏文章", articleId);
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
    console.log("已成功取得收藏文章");
    res.status(200).send({ savedArticles: user.savedArticles });
  } catch (error) {
    res.status(500).send({ message: "獲取收藏文章時發生錯誤" });
  }
};

const subscribeBoard = async (req, res) => {
  const userId = req.userId;
  const { boardId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "用户未找到" });
    }

    const isSubscribed = user.subscribedBoards.includes(boardId);
    console.log("該看板是否已訂閱", isSubscribed);
    if (!isSubscribed) {
      user.subscribedBoards.push(boardId);
      console.log("订阅看板", boardId);
    } else {
      const index = user.subscribedBoards.indexOf(boardId);
      if (index !== -1) {
        user.subscribedBoards.splice(index, 1);
        console.log("取消订阅看板", boardId);
      }
    }

    await user.save();
    res.status(200).json({ message: "订阅状态更新成功" });
  } catch (error) {
    res.status(500).json({ message: "处理订阅请求时发生错误" });
  }
};

const getSubscribedBoards = async (req, res) => {
  try {
    const userId = req.userId; // 获取用户ID，通常从认证中间件或JWT令牌中获得
    const user = await User.findById(userId).populate("subscribedBoards");

    if (!user) {
      return res.status(404).json({ message: "用户未找到" });
    }

    // 假设我们只返回订阅看板的ID数组
    const subscribedBoardIds = user.subscribedBoards.map((board) => board._id);
    console.log("後端取得訂閱看版");
    res.status(200).json(subscribedBoardIds);
  } catch (error) {
    console.error("获取订阅状态时发生错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

module.exports = {
  getUserProfile,
  saveArticle,
  getSaveArticle,
  subscribeBoard,
  getSubscribedBoards,
};

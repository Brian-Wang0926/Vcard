const User = require("../models/user-model");
const Chat = require("../models/chat-model");

const getAllFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "friends",
      "_id name thumbnail"
    );
    if (!user) {
      return res.status(404).send("找不到該用戶");
    }
    if (!user.friends || user.friends.length === 0) {
      return res.status(200).json([]);
    }

    // console.log("後端", user.friends);
    res.status(200).json(user.friends);
  } catch (e) {
    console.error(e);
    res.status(500).send("伺服器內部錯誤");
  }
};

const getChatWithFriend = async (req, res) => {
  try {
    const userId = req.userId; // 這裡假設你將已登入用戶的id保存在req.userId中
    const friendId = req.params.friendId;

    const chats = await Chat.find({
      $or: [
        { fromUserId: userId, toUserId: friendId },
        { fromUserId: friendId, toUserId: userId },
      ],
    }).sort("createdAt");

    res.status(200).json(chats);
  } catch (e) {
    console.error(e);
    res.status(500).send("伺服器內部錯誤");
  }
};

// const sendMessage = async (req, res) => {
//   const { toUserId, message } = req.body;

//   if (!toUserId || !message) {
//     return res
//       .status(400)
//       .json({ error: "Both toUserId and message are required." });
//   }

//   // 儲存消息到資料庫
//   const chatMessage = new Chat({
//     toUserId,
//     message,
//   });

//   chatMessage.save((err) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to save message." });
//     }

//     res.status(200).json({ success: true });
//   });
// };

module.exports = {
  getAllFriends,
  getChatWithFriend,
  // sendMessage,
};

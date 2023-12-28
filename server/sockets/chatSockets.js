const Chat = require("../models/chat-model");

module.exports = function (socket, io) {
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("private_message", async (data) => {
    const { fromUserId, toUserId, message } = data;

    if (!fromUserId || !toUserId || !message) {
      socket.emit("error_message", "必須提供發送者、接收者和消息內容。");
      return;
    }

    try {
      const chatMessage = new Chat({
        fromUserId: fromUserId,
        toUserId: toUserId,
        message: message,
      });

      await chatMessage.save();

      io.to(toUserId).emit("new_message", {
        from: fromUserId,
        message: message,
      });
    } catch (error) {
      console.error("Error saving chat message:", error);
      socket.emit("error_message", "保存聊天消息時出現錯誤。");
    }
  });
};

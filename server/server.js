// server.js
const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const rabbitMQConsumer = require("./services/rabbitmq-consumer");
const chatSocketHandler = require("./sockets/chatSockets");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.APP_URI, // 指定前端來源
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected via WebSocket");

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // 註冊用戶
  socket.on("register", (userId) => {
    console.log("User registered with ID:", userId);
    if (userId) {
      socket.join(userId.toString());
    } else {
      console.log("Received null or undefined userId");
    }
  });

  // 聊天功能處理
  chatSocketHandler(socket, io);

  socket.on("disconnect", (reason) => {
    if (reason === "transport close" || reason === "ping timeout") {
      console.log("Lost network connection");
      // 在這裡處理網絡斷開的情況
    }
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // 启动RabbitMQ消息消费者
  rabbitMQConsumer.consumeMessage("notify_queue", (content) => {
    console.log("Received message from RabbitMQ:", content);
    // 发送WebSocket消息到特定用户
    io.to(content.userId.toString()).emit("newNotification", content);
    console.log(
      "Notification message sent to socket for user:",
      content.userId
    );
  });
});



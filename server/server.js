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

  // 其他功能，如需要
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // 启动RabbitMQ消息消费者
  rabbitMQConsumer.consumeMessage("notify_queue", (content) => {
    console.log("Received message from RabbitMQ:", content, content.userId);

    // 发送WebSocket消息到特定用户
    io.to(content.userId.toString()).emit("newNotification", content);
  });
});

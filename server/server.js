// server.js
const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.APP_URI, // 指定前端來源
    methods: ["GET", "POST"],
  },
});

require("./sockets/chatSockets")(io); // 導入socket配置

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

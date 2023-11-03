// server.js
const app = require("./app");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // 指定前端來源
    methods: ["GET", "POST"],
  },
});

require("./sockets/chatSockets")(io); // 導入socket配置

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

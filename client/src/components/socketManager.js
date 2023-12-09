import socketIOClient from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = socketIOClient(process.env.REACT_APP_API_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 10000,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("register", userId);
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connect error:", error);
    });

    socket.on("reconnect_failed", () => {
      console.error("WebSocket reconnect failed");
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

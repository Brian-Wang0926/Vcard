import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import authServiceInstance from "../services/auth-service";

const ChatRoomComponent = (props) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const chatContainerRef = useRef(null);
  const socket = useRef(socketIOClient(process.env.REACT_APP_API_URL));

  useEffect(() => {
    // 當好友被選中，從後端取得聊天紀錄
    const currentSocket = socket.current;

    currentSocket.emit("join", props.currentUser.id);

    currentSocket.on("new_message", (data) => {
      setChat((oldChats) => [...oldChats, data]);
    });

    return () => currentSocket.disconnect();
  }, [props.currentUser.id]);

  useEffect(() => {
    async function fetchChatHistory() {
      if (props.otherUserId) {
        try {
          const headers = authServiceInstance.authHeader();
          const response = await axios.get(`api/chat/${props.otherUserId}`, {
            headers,
          });
          setChat(response.data);
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      }
    }
    fetchChatHistory();
  }, [props.otherUserId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    // 每當 chat 狀態更新時，滾動到最底部
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = () => {
    console.log(
      `前端從${props.currentUser.id}發送訊息給${props.otherUserId}內容是${message}`
    );

    socket.current.emit("private_message", {
      fromUserId: props.currentUser.id,
      toUserId: props.otherUserId,
      message: message,
    });

    // 新增以下程式碼以即時顯示自己的訊息
    setChat((oldChats) => [
      ...oldChats,
      {
        fromUserId: props.currentUser.id,
        message: message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="m-2">
      <h3>id：{props.otherUserId}</h3>
      <h3>姓名：{props.otherUserName}</h3>
      <br></br>
      <div className="max-h-96 overflow-y-auto" ref={chatContainerRef}>
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.fromUserId === props.currentUser.id
                ? "flex justify-end"
                : "flex"
            }`}
          >
            {msg.fromUserId !== props.currentUser.id && (
              <div className="flex items-center my-1">
                {/* 這裡顯示發送者的名字和頭像 */}
                <img
                  src={props.otherUserAvatarUrl} // 這裡應該替換成發送者的頭像URL
                  alt={props.otherUserName} // 這裡應該替換成發送者的名字
                  className="w-8 h-8 rounded-full mr-2"
                />
                {/* <span>{props.otherUserName}</span> */}
              </div>
            )}
            <p
              className={`m-2 p-2 rounded inline-block ${
                msg.fromUserId === props.currentUser.id
                  ? "bg-green-200"
                  : "bg-gray-200"
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      <br></br>
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoomComponent;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import useUserStore from "../stores/userStore";
import { initSocket, getSocket } from "./socketManager";

const ChatRoomComponent = (props) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const { currentUser } = useUserStore();
  const chatContainerRef = useRef(null);
  const isOtherUserSelected = Boolean(props.otherUserId);
  useEffect(() => {
    const currentSocket = initSocket(currentUser.id);

    currentSocket.on("new_message", (data) => {
      setChat((oldChats) => [...oldChats, data]);
    });

    return () => currentSocket.off("new_message");
  }, [currentUser]);

  useEffect(() => {
    async function fetchChatHistory() {
      if (props.otherUserId) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/chat/${props.otherUserId}`,
            {
              headers: authServiceInstance.authHeader(),
            }
          );
          setChat(response.data);
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      }
    }
    fetchChatHistory();
  }, [props.otherUserId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim() && isOtherUserSelected) {
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
    if (!message.trim() || !isOtherUserSelected) {
      return; // 如果没有输入文本或没有选中聊天对象，不执行发送操作
    }

    const currentSocket = getSocket();
    const newMessage = {
      fromUserId: currentUser.id,
      toUserId: props.otherUserId,
      message: message,
    };

    currentSocket.emit("private_message", newMessage);

    // 新增以下程式碼以即時顯示自己的訊息
    setChat((oldChats) => [
      ...oldChats,
      {
        fromUserId: currentUser.id,
        message: message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* 好友資訊 */}
      <div className="flex-none p-2">
        <div className="text-lg leading-6 font-medium text-gray-900">
          {props.otherUserName}
        </div>
      </div>
      {/* 顯示區 */}
      <div
        className="flex-1 overflow-y-auto p-2 bg-gray-100"
        ref={chatContainerRef}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.fromUserId === currentUser.id ? "flex justify-end" : "flex"
            }`}
          >
            {msg.fromUserId !== currentUser.id && (
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
                msg.fromUserId === currentUser.id
                  ? "bg-green-200"
                  : "bg-blue-200"
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>
      {/* 輸入區 */}
      <div className="flex-none p-2">
        <div className="flex items-center">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border border-gray-300 rounded px-4 py-2 mr-2 "
            disabled={!isOtherUserSelected}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={!isOtherUserSelected}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomComponent;

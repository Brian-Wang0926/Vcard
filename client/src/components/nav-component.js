import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate, NavLink } from "react-router-dom";
import AuthService from "../services/auth-service";
import useUserStore from "../stores/userStore";
import useNotificationStore from "../stores/notificationStore";
import PenIcon from "../icons/8664843_pen_to_square_icon.svg";
import CardIcon from "../icons/8664908_window_restore_application_icon.svg";
import ChatIcon from "../icons/8664935_message_chat_communication_icon.svg";
import ProfileIcon from "../icons/8664831_user_icon.svg";
import NotifyIcon from "../icons/8664802_bell_icon.svg";
import NotificationsComponent from "./notifications-component";
// import SearchBar from "./searchBar";

const NavComponent = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const { notifications, addNotification } = useNotificationStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      const socket = socketIOClient(process.env.REACT_APP_API_URL, {
        reconnectionAttempts: 5, // 重连尝试次数
        reconnectionDelay: 10000, // 重连延迟时间（毫秒）
      });
      
      socket.on("connect", () => {
        socket.emit("register", currentUser.id);
      });

      socket.on("newNotification", (message) => {
        console.log("newNotification顯示message", message);
        addNotification(message);
      });

      return () => socket.disconnect();
    }
  }, [currentUser, addNotification]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotifications]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    AuthService.logout(); //清空 Local storage
    window.alert("登出成功，您現在會被導向到首頁");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div>
      <nav
        className="bg-gray-300 fixed top-0 left-0 right-0 z-10"
        style={{ height: "56px" }}
      >
        <div className="mx-auto max-w-screen-xl px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <a
              href="/"
              className="p-2 text-black font-bold tracking-widest text-3xl"
            >
              Vcard
            </a>
            {/* <SearchBar /> */}
            <ul className="flex space-x-4">
              {currentUser && (
                <li className="nav-item">
                  <NavLink to="/post">
                    <img src={PenIcon} className="w-6 h-6 m-2" alt="寫文章" />
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink to="/card">
                    <img src={CardIcon} className="w-6 h-6 m-2" alt="抽卡" />
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink to="/chat">
                    <img src={ChatIcon} className="w-6 h-6 m-2" alt="聊天" />
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item relative" ref={notificationRef}>
                  <div
                    onClick={handleNotificationClick}
                    className="relative cursor-pointer"
                  >
                    <img src={NotifyIcon} className="w-6 h-6 m-2" alt="通知" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-3 -right-2 bg-red-500 rounded text-white  bg-opacity-90  px-1.5 py-1 text-xs">
                        {notifications.length > 9 ? "9+" : notifications.length}
                      </span>
                    )}
                  </div>
                  {showNotifications && <NotificationsComponent />}
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink to="/profile">
                    <img src={ProfileIcon} className="w-6 h-6 m-2" alt="個人" />
                  </NavLink>
                </li>
              )}
              {!currentUser && (
                <li className="nav-item">
                  <NavLink to="/login">登入</NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item flex items-center">
                  <NavLink onClick={handleLogout} to="/login">
                    登出
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavComponent;

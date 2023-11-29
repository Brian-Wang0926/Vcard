import React from "react";
import { NavLink } from "react-router-dom";
import AuthService from "../services/auth-service";
import PenIcon from "../icons/8664843_pen_to_square_icon.svg";
import CardIcon from "../icons/8664908_window_restore_application_icon.svg";
import ChatIcon from "../icons/8664935_message_chat_communication_icon.svg";
import ProfileIcon from "../icons/8664831_user_icon.svg";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthService.logout(); //清空 Local storage
    window.alert("登出成功，您現在會被導向到首頁");
    setCurrentUser(null);
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? "text-black" : "text-gray-400 hover:text-gray-700";
  };

  return (
    <div>
      <nav className="bg-gray-300 fixed top-0 left-0 right-0 z-10" style={{ height: '56px' }}>
        <div className="mx-auto max-w-screen-xl px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <a
              href="/"
              className="p-2 text-black font-bold tracking-widest text-3xl"
            >
              Vcard
            </a>
            <ul className="flex space-x-4">
              {/* <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/">
                  首頁
                </NavLink>
              </li> */}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/post">
                    <img src={PenIcon} className="w-6 h-6 m-2" alt="寫文章" />
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/card">
                    <img src={CardIcon} className="w-6 h-6 m-2" alt="抽卡" />
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/chat">
                    <img src={ChatIcon} className="w-6 h-6 m-2" alt="聊天" />
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/profile">
                    <img src={ProfileIcon} className="w-6 h-6 m-2" alt="個人" />
                  </NavLink>
                </li>
              )}
              {!currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/login">
                    登入
                  </NavLink>
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

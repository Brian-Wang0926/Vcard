import React from "react";
import { NavLink } from "react-router-dom";
import AuthService from "../services/auth-service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthService.logout(); //清空 Local storage
    window.alert("登出成功，您現在會被導向到首頁");
    setCurrentUser(null);
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? "text-black" : "text-white hover:text-gray-300";
  };

  return (
    <div>
      <nav className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="flex justify-between items-center">
            <a href="/" className="mr-4 ">
              Vcard
              {/* <img
                src="/path-to-your-logo.png"
                alt="Logo"
                className="h-8 w-auto"
              />{" "} */}
            </a>
            <ul className="flex space-x-4 ml-auto">
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/">
                  首頁
                </NavLink>
              </li>
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/post">
                    寫文章
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/card">
                    抽卡
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/chat">
                    聊天
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/profile">
                    個人頁面
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
                <li className="nav-item">
                  <NavLink
                    onClick={handleLogout}
                    className="text-white"
                    to="/login"
                  >
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

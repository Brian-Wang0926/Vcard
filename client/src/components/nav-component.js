import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth-service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthService.logout(); //清空 Local storage
    window.alert("登出成功，您現在會被導向到首頁");
    setCurrentUser(null);
  };
  return (
    <div>
      <nav className="bg-gray-200 p-4">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="flex justify-between items-center">
            <ul className="flex space-x-4 ml-auto">
              <li className="nav-item">
                <Link className="text-gray-700 hover:text-black" to="/">
                  首頁
                </Link>
              </li>
              {currentUser && (
                <li className="nav-item">
                  <Link className="text-gray-700 hover:text-black" to="/post">
                    寫文章
                  </Link>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <Link className="text-gray-700 hover:text-black" to="/card">
                    抽卡
                  </Link>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <Link className="text-gray-700 hover:text-black" to="/chat">
                    聊天
                  </Link>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <Link
                    className="text-gray-700 hover:text-black"
                    to="/profile"
                  >
                    個人頁面
                  </Link>
                </li>
              )}
              {!currentUser && (
                <li className="nav-item">
                  <Link className="text-gray-700 hover:text-black" to="/login">
                    登入
                  </Link>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <Link
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-black"
                    to="/login"
                  >
                    登出
                  </Link>
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

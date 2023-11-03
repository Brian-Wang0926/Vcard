import React, { useState, useEffect } from "react";
import authServiceInstance from "../services/auth-service";
import axios from "axios";

const LoginComponent = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 获取用户列表的函数
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/auth/mock-users"); // 假设你有一个API端点来获取用户列表
        setUsers(response.data); // 假设响应的数据是一个用户数组
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const mockLogin = async () => {
    try {
      const response = await authServiceInstance.mockLogin({
        userId: selectedUserId,
      });
      if (response.data && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.href = "/profile";
      }
    } catch (error) {
      console.error("模擬登入失敗:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <a
        className="bg-black text-white py-1 px-2 flex items-center justify-center rounded-lg w-1/3 mt-10"
        href={`${process.env.REACT_APP_API_URL}/api/auth/google`}
      >
        <img
          src="https://img.icons8.com/color/16/000000/google-logo.png"
          className="mr-2"
          alt="Google logo"
        />
        Login with google
      </a>
      {process.env.REACT_APP_MOCK_ENV === "true" && (
        <div>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="" disabled>
              Select a mock user
            </option>
            {users.map(
              (
                user 
              ) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              )
            )}
          </select>
          <button
            className="bg-blue-500 text-white py-1 px-2 mt-5 rounded-lg"
            onClick={mockLogin}
          >
            模擬登入
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;

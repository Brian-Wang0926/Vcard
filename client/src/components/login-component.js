import React, { useState } from "react";
import authServiceInstance from "../services/auth-service";
// import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  // const navigate = useNavigate();

  const mockLogin = async () => {
    try {
      const response = await authServiceInstance.mockLogin({
        userId: selectedUserId,
      });
      if (response.data && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        // 可以在這裡加上一些提示或者重新導向，例如：跳轉到主頁
        // navigate("/profile");
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
            <option value="6540dc219b627a575d2a67ba">Mock User 1</option>
            <option value="6540dc219b627a575d2a67bb">Mock User 2</option>
            <option value="6540dc219b627a575d2a67bc">Mock User 3</option>
            <option value="6540dc219b627a575d2a67bd">Mock User 4</option>
            <option value="6540dc219b627a575d2a67be">Mock User 5</option>
            <option value="6540dc219b627a575d2a67bf">Mock User 6</option>
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./hoc/requireAuth";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import CardComponent from "./components/card-component";
import ChatComponent from "./components/chat-component";
import PostComponent from "./components/post-component";
import useUserStore from "./stores/userStore";
import authServiceInstance from "./services/auth-service";
import RedirectToHome from "./components/redirectToHome";

function App() {
  const [boards, setBoards] = useState([]); // 新增看板數據的狀態
  const { setCurrentUser, setAuthChecked } = useUserStore();

  useEffect(() => {
    const storedUser = authServiceInstance.getCurrentUser(); // 从 localStorage 获取用户数据
    if (storedUser) {
      setCurrentUser(storedUser); // 更新 Zustand store
      setAuthChecked(true); // 用户已登录，设置 authChecked 为 true
      console.log("設定setCurrentUser及setAuthChecked為true");
    } else {
      setAuthChecked(false); // 用户未登录，设置 authChecked 为 false
    }
  }, [setCurrentUser, setAuthChecked]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/article/boards`
        );
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchBoards();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<HomeComponent boards={boards} setBoards={setBoards} />}
          />
          <Route path="login" element={<LoginComponent />} />
          <Route path="*" element={<RedirectToHome />} />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <ProfileComponent />
              </RequireAuth>
            }
          />
          <Route
            path="card"
            element={
              <RequireAuth>
                <CardComponent />
              </RequireAuth>
            }
          />
          <Route
            path="chat"
            element={
              <RequireAuth>
                <ChatComponent />
              </RequireAuth>
            }
          />
          <Route
            path="post"
            element={
              <RequireAuth>
                <PostComponent boards={boards} />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

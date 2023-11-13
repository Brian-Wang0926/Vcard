import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthService from "./services/auth-service";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import CardComponent from "./components/card-component";
import ChatComponent from "./components/chat-component";
import PostComponent from "./components/post-component";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [boards, setBoards] = useState([]); // 新增看板數據的狀態

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("/api/article/boards");
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
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route
            index
            element={
              <HomeComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                boards={boards}
                setBoards={setBoards}
              />
            }
          />
          <Route
            path="login"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="profile"
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="card"
            element={
              <CardComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="chat"
            element={
              <ChatComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="post"
            element={
              <PostComponent
                boards={boards}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

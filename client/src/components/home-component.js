import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BoardListComponent from "./boardList-component";
import ArticleListComponent from "./articleList-component";
import useUserStore from "../stores/userStore";
import authService from "../services/auth-service";

function HomeComponent({ boards, setBoards }) {
  const [searchParams] = useSearchParams();
  const [selectedBoard, setSelectedBoard] = useState(null); // null 表示所有文章
  const { currentUser, setCurrentUser } = useUserStore();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setCurrentUser(currentUser); // 设置当前用户，如果用户未登录或令牌无效则为 null

    const token = searchParams.get("token");
    if (token) {
      const name = searchParams.get("name");
      const id = searchParams.get("id");
      const userObj = { token: token, name: name, id: id };
      localStorage.setItem("user", JSON.stringify(userObj));
      setCurrentUser(userObj);
    }
  }, [searchParams, setCurrentUser]);

  return (
    <div className=" bg-gray-800 min-h-screen pt-14 ">
      <div className="flex mx-auto max-w-screen-xl">
        <div className="flex-none w-1/4">
          <BoardListComponent
            boards={boards}
            setBoards={setBoards}
            setSelectedBoard={setSelectedBoard}
          />
        </div>
        <div className="flex-none w-3/4">
          <ArticleListComponent
            board={selectedBoard}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;

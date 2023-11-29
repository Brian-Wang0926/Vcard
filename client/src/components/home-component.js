import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthService from "../services/auth-service";
import BoardListComponent from "./boardList-component";
import ArticleListComponent from "./articleList-component";

function HomeComponent({ currentUser, setCurrentUser, boards, setBoards }) {
  const [searchParams] = useSearchParams();
  const [selectedBoard, setSelectedBoard] = useState(null); // null 表示所有文章

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      const name = searchParams.get("name");
      const id = searchParams.get("id");
      const Obj = { token: token, name, id };
      localStorage.setItem("user", JSON.stringify(Obj));
      console.log("已將token存進localStorage");
      setCurrentUser(AuthService.getCurrentUser());
    }
  }, [searchParams, setCurrentUser]);

  return (
    <div className=" bg-gray-800 min-h-screen pt-14 overflow-hidden ">
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

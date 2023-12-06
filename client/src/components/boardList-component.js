import React, { useEffect } from "react";
import useUserStore from "../stores/userStore";
import starGray from "../icons/star_gray.svg";
import starBlue from "../icons/star_blue.svg";
import authServiceInstance from "../services/auth-service";
import axios from "axios";

const BoardListComponent = ({ boards, setSelectedBoard }) => {
  const { subscribedBoards, toggleSubscribedBoard } = useUserStore();

  const handleBoardClick = (board) => {
    setSelectedBoard(board);
  };

  const handleSubscribeClick = async (boardId, e) => {
    e.stopPropagation(); // 防止触发 handleBoardClick
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/profile/subscribe`,
        { boardId },
        { headers: authServiceInstance.authHeader() }
      );

      if (response.status === 200) {
        toggleSubscribedBoard(boardId);
      }
    } catch (error) {
      console.error("Error subscribing to board:", error);
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profile/subscribe`,
          { headers: authServiceInstance.authHeader() }
        );
        console.log("發api取得訂閱看版", response);
        if (response.status === 200) {
          console.log("取得訂閱看版資料", response.data);
          useUserStore.setState({ subscribedBoards: new Set(response.data) });
        }
      } catch (error) {
        console.error("获取订阅状态时发生错误:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  if (!boards.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 my-2 text-white">
      <h1 className="mb-4">看板列表</h1>
      {boards.map((board) => (
        <div
          key={board._id}
          onClick={() => handleBoardClick(board)}
          className="flex justify-between items-center cursor-pointer hover:bg-blue-700 p-2 rounded transition-colors duration-200 ease-in-out"
        >
          <div className="flex items-center">
            {board.icon} <span className="ml-2">{board.name}</span>
          </div>
          <img
            src={subscribedBoards.has(board._id) ? starBlue : starGray}
            alt="Subscribe"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // 防止触发 handleBoardClick
              handleSubscribeClick(board._id, e);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default BoardListComponent;

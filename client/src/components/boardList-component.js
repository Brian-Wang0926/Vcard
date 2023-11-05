import React, { useEffect, useState } from "react";
import axios from "axios";

const BoardListComponent = ({ setSelectedBoard }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("/api/article/boards");
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleBoardClick = (board) => {
    setSelectedBoard(board);
  };

  return (
    <div className="bg-blue-900 rounded-lg p-4 my-2 text-white">
      <h1 className="mb-4">看板列表</h1>
      {boards.map((board) => (
        <div
          key={board._id}
          onClick={() => handleBoardClick(board)}
          className="cursor-pointer hover:bg-blue-700 p-2 rounded transition-colors duration-200 ease-in-out"
        >
          <div>
            {board.icon} {board.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardListComponent;

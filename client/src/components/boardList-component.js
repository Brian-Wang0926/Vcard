import React from "react";

const BoardListComponent = ({ boards, setSelectedBoard }) => {

  const handleBoardClick = (board) => {
    setSelectedBoard(board);
  };

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

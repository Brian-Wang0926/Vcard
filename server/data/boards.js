const mongoose = require("mongoose");
const Board = require("../models/board-model");

mongoose
  .connect("mongodb://localhost:27017/Vcard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("連接mongoDB資料庫");
  })
  .catch((e) => {
    console.log(e);
  });

const boardsData = [
  { name: "心情", englishName: "Mood", icon: "😔" },
  { name: "閒聊", englishName: "Chat", icon: "💬" },
  { name: "感情", englishName: "Relationship", icon: "💓" },
  { name: "工作", englishName: "Work", icon: "💼" },
  { name: "素食", englishName: "Vegetarian", icon: "🥦" },
  { name: "梗圖", englishName: "Memes", icon: "😂" },
  { name: "軟體工程師", englishName: "Software Engineer", icon: "💻" },
];

async function checkAndAddBoards(boards) {
  try {
    for (let board of boards) {
      const existingBoard = await Board.findOne({ name: board.name });
      if (existingBoard) {
        console.log(`看板 ${board.name} 已存在`);
      } else {
        const newBoard = new Board(board);
        await newBoard.save();
        console.log(`看板 ${board.name} 新增成功`);
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    mongoose.disconnect();
    console.log("資料庫關閉");
  }
}
checkAndAddBoards(boardsData);

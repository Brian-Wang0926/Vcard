const Article = require("../models/article-model");
const Board = require("../models/board-model");

// 看板
const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// 文章
const createArticle = async (req, res) => {
  try {
    const { title, content, author, board, mediaUrls } = req.body;
    const newArticle = await Article.create({
      title,
      content,
      author,
      board,
      mediaUrls,
    });
    res.status(201).json(newArticle);
  } catch (e) {
    res.status(500).json({ message: "無法創建文章", e });
  }
};

const getArticles = async (req, res) => {
  try {
    let query = {};
    if (req.query.board) {
      query.board = req.query.board;
    }
    const articles = await Article.find(query)
      .populate("author", "name")
      .populate("board", "name")
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (e) {
    res.status(500).json({ message: "無法獲取文章", e });
  }
};

module.exports = {
  getAllBoards,
  createArticle,
  getArticles,
};

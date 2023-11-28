const Article = require("../models/article-model");
const Board = require("../models/board-model");
const dotenv = require("dotenv");
dotenv.config();

// 看板
const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).send(error.message);
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

const getArticlesByUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("開始篩選使用者文章", userId);
    // 根据 userId 查询文章
    const articles = await Article.find({ author: userId })
      .populate("author", "name")
      .populate("board", "name")
      .sort({ createdAt: -1 });
    console.log("篩選結果", articles);
    res.json(articles);
  } catch (e) {
    res.status(500).json({ message: "無法獲取文章", e });
  }
};

const uploadImageToS3 = async (req, res) => {
  try {
    const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
    const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

    const s3Client = new S3Client({
      region: process.env.YOUR_AWS_REGION,
      credentials: {
        accessKeyId: process.env.YOUR_AWS_ACCESS_KEY,
        secretAccessKey: process.env.YOUR_AWS_SECRET_KEY,
      },
    });

    const { fileName, fileType } = req.query;
    console.log("後端api", fileName, fileType);

    const command = new PutObjectCommand({
      Bucket: process.env.YOUR_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 36000,
    });
    console.log("後端儲存至s3成功", signedUrl);

    res.json({ url: signedUrl });
  } catch (err) {
    console.error("Error creating presigned URL", err);
    res.status(500).json({ message: "Error creating presigned URL", err });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, author, board } = req.body;
    const newArticle = new Article({
      title,
      content,
      author,
      board,
    });
    await newArticle.save();
    console.log("已成功儲存到資料庫", newArticle);
    res.status(200).json(newArticle);
  } catch (e) {
    res.status(500).json({ message: "無法創建文章", e });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    console.log("資料庫找到文章", article);
    if (!article) {
      return res.status(404).json({ message: "文章未找到" });
    }
    if (article.author._id.toString() !== req.userId) {
      return res.status(403).json({ message: "無權刪除文章" });
    }
    await Article.findByIdAndRemove(req.params.id);
    console.log("刪除成功");
    res.status(200).json({ message: "文章已刪除" });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "無法刪除文章", e });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, board } = req.body;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "文章未找到" });
    }

    if (article.author.toString() !== req.userId) {
      return res.status(403).json({ message: "無權更新文章" });
    }

    article.title = title;
    article.content = content;
    article.board = board;

    const updatedArticle = await article.save();
    res.status(200).json(updatedArticle);
    console.log("文章修改成功");
  } catch (e) {
    res.status(500).json({ message: "更新文章時出現錯誤", e });
  }
};

const likeArticle = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId; // 从认证中间件获取当前用户的 ID

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "文章未找到" });
    }

    if (article.likes.includes(userId)) {
      article.likes.pull(userId);
    } else {
      article.likes.push(userId);
    }

    await article.save();
    console.log("後端成功點擊該文章喜歡", article);
    res.status(200).json(article);
  } catch (e) {
    res.status(500).json({ message: "处理点赞时出现错误", e });
  }
};

module.exports = {
  getAllBoards,
  createArticle,
  getArticles,
  uploadImageToS3,
  getArticlesByUser,
  deleteArticle,
  updateArticle,
  likeArticle,
};

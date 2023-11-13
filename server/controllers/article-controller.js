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

// 文章
const createArticle = async (req, res) => {
  try {
    const { title, content, author, board, mediaUrls } = req.body;
    const newArticle = new Article({
      title,
      content,
      author,
      board,
      mediaUrls,
    });
    await newArticle.save();
    console.log("已成功儲存到資料庫", newArticle);
    res.status(201).json(newArticle);
  } catch (e) {
    res.status(500).json({ message: "無法創建文章", e });
  }
};

// const getPresignedUrl = async (req, res) => {
//   const { fileName, fileType } = req.query;

//   if (!fileName || !fileType) {
//     return res.status(400).json({
//       message: "fileName and fileType query parameters are required.",
//     });
//   }

//   const command = new GetObjectCommand({
//     Bucket: process.env.YOUR_S3_BUCKET_NAME,
//     Key: String(fileName),
//   });

//   try {
//     const signedUrl = await getSignedUrl(s3Client, command, {
//       expiresIn: 3600,
//     });
//     res.json({ url: signedUrl });
//   } catch (err) {
//     console.error("Error creating presigned URL", err);
//     res.status(500).json({ message: "Error creating presigned URL", err });
//   }
// };

module.exports = {
  getAllBoards,
  createArticle,
  getArticles,
  uploadImageToS3,

  // getPresignedUrl,
};

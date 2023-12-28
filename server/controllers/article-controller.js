const Article = require("../models/article-model");
const Board = require("../models/board-model");
const User = require("../models/user-model");
const redisClient = require("../redis-client");
const rabbitMQService = require("../services/rabbitmq-service");
const dotenv = require("dotenv");
dotenv.config();

// 看板
const getAllBoards = async (req, res) => {
  const cacheKey = "allBoards";

  try {
    const cachedBoards = await redisClient.get(cacheKey);
    if (cachedBoards) {
      return res.json(JSON.parse(cachedBoards));
    }

    const boards = await Board.find();
    await redisClient.set(cacheKey, JSON.stringify(boards));
    res.json(boards);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getArticlesByUser = async (req, res) => {
  try {
    const userId = req.userId;
    // 根据 userId 查询文章
    const articles = await Article.find({ author: userId })
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

    const command = new PutObjectCommand({
      Bucket: process.env.YOUR_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 36000,
    });
    res.json({ url: signedUrl });
  } catch (err) {
    console.error("Error creating presigned URL", err);
    res.status(500).json({ message: "Error creating presigned URL", err });
  }
};

const getPartArticles = async (req, res) => {
  try {
    // const cacheKey = `articlesPreview:${JSON.stringify(req.query)}`;

    // // 嘗試從 Redis 中獲取緩存數據
    // const cachedArticles = await redisClient.get(cacheKey);
    // if (cachedArticles) {
    //   console.log("透過redis提供");
    //   const articles = JSON.parse(cachedArticles);
    //   articles.forEach((article) => (article.isFromCache = true));
    //   return res.json(articles);
    // }

    let query = {};

    if (req.query.board) {
      query.board = req.query.board;
    }
    if (req.query.authorId) {
      query.author = req.query.authorId;
    }
    // 检查是否存在 savedArticleIds 参数
    if ("savedArticleIds" in req.query) {
      const savedArticleIds = req.query.savedArticleIds.split(",");
      if (savedArticleIds.length === 0 || savedArticleIds[0] === "") {
        return res.json([]);
      }
      query._id = { $in: savedArticleIds };
    } else {
      // 这里可以根据需要处理当 savedArticleIds 参数未提供的情况
    }

    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;

    const articles = await Article.find(query)
      .populate("author", "name")
      .populate("board", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    // 提取文章预览信息
    const articlesPreview = articles.map((article) => {
      const imageRegex = /!\[.*?\]\((.*?)\)/;
      const textRegex = /(?:\r\n|\r|\n|^)([^]*?)(?:\r\n|\r|\n|$)/;
      const firstImageUrl = article.content.match(imageRegex)?.[1] || null;
      const previewText =
        article.content.match(textRegex)?.[1]?.slice(0, 100) || "";

      return {
        ...article.toObject(),
        content: previewText,
        firstImageUrl: firstImageUrl,
        isFromCache: false,
      };
    });

    // 將數據存儲到 Redis，設置緩存時間（ 1 小時）
    // await redisClient.set(cacheKey, JSON.stringify(articlesPreview), {
    //   EX: 3600,
    // });

    res.json(articlesPreview);
  } catch (e) {
    res.status(500).json({ message: "無法獲取文章", e });
  }
};

const getFullArticle = async (req, res) => {
  const articleId = req.params.id;
  const cacheKey = `article:${articleId}`;
  // console.log("取得cacheKey", cacheKey);
  try {
    // 嘗試從 Redis 中獲取緩存數據
    const cachedArticle = await redisClient.get(cacheKey);
    if (cachedArticle) {
      const article = JSON.parse(cachedArticle);
      article.isFromCache = true;
      return res.json(article);
    }

    // 從資料庫獲取數據
    const article = await Article.findById(articleId)
      .populate("author", "name")
      .populate("board", "name");

    if (!article) {
      return res.status(404).json({ message: "文章未找到" });
    }
    article.isFromCache = false;
    // 將數據存儲到 Redis，設置緩存時間（ 1 小時）
    await redisClient.set(cacheKey, JSON.stringify(article), {
      EX: 3600,
    });

    res.json(article);
  } catch (e) {
    res.status(500).json({ message: "無法獲取文章", e });
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

    // 清除文章列表的缓存
    // await redisClient.del("articlesPreview:*");
    // console.log("createArticle清理緩存");

    // 获取看板名称
    const boardData = await Board.findById(board);
    const boardName = boardData ? boardData.name : "";

    // 查找订阅了这个看板的所有用户
    // 是抓所有資料，是否抓id就好
    const subscribedUsers = await User.find({ subscribedBoards: board });

    // 对每个用户发送通知消息
    subscribedUsers.forEach((user) => {
      rabbitMQService.sendMessage("notify_queue", {
        userId: user._id,
        articleId: newArticle._id,
        message: `New post "${title}" in your subscribed board: ${boardName}`,
      });
    });

    res.status(200).json(newArticle);
  } catch (e) {
    res.status(500).json({ message: "無法創建文章", e });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "文章未找到" });
    }
    if (article.author._id.toString() !== req.userId) {
      return res.status(403).json({ message: "無權刪除文章" });
    }
    await Article.findByIdAndRemove(articleId);

    // 清除这篇文章的缓存
    await redisClient.del(`article:${articleId}`);

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

    // 清除這篇文章的緩存
    await redisClient.del(`article:${id}`);

    res.status(200).json(updatedArticle);
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

    const updatedArticle = await article.save();

    // 更新 Redis 缓存
    const cacheKey = `article:${id}`;
    const cachedArticle = await redisClient.get(cacheKey);
    if (cachedArticle) {
      // 如果缓存中有文章，只更新点赞信息
      const updatedCacheArticle = JSON.parse(cachedArticle);
      updatedCacheArticle.likes = article.likes;

      // 将更新后的文章数据存回 Redis 缓存
      await redisClient.set(cacheKey, JSON.stringify(updatedCacheArticle), {
        EX: 3600, // 设置缓存过期时间，例如 1 小时
      });
    }

    res.status(200).json(updatedArticle);
  } catch (e) {
    res.status(500).json({ message: "处理点赞时出现错误", e });
  }
};


module.exports = {
  getAllBoards,
  createArticle,
  getFullArticle,
  getPartArticles,
  uploadImageToS3,
  getArticlesByUser,
  deleteArticle,
  updateArticle,
  likeArticle,
};

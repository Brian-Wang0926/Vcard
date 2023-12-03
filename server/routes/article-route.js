const router = require("express").Router();
const articleController = require("../controllers/article-controller");
const { authMiddleware } = require("../controllers/auth-controller");

router.get("/boards", articleController.getAllBoards);

router.get("/getPresignedUrl", articleController.uploadImageToS3);

// 取得單一完整文章
router.get("/:id", articleController.getFullArticle);
// 取得全部預覽文章
router.get("/", articleController.getPartArticles);

router.get("/user", authMiddleware, articleController.getArticlesByUser);

router.post("/", authMiddleware, articleController.createArticle);

router.delete("/:id", authMiddleware, articleController.deleteArticle);

router.put("/:id", authMiddleware, articleController.updateArticle);

router.put("/:id/like", authMiddleware, articleController.likeArticle);

module.exports = router;

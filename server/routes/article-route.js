const router = require("express").Router();
const articleController = require("../controllers/article-controller");
const { authMiddleware } = require("../controllers/auth-controller");

router.get("/boards", articleController.getAllBoards);

router.get("/", articleController.getArticles);

router.get("/user", authMiddleware, articleController.getArticlesByUser);

router.get("/get-presigned-url", articleController.uploadImageToS3);

router.post("/", authMiddleware, articleController.createArticle);

router.delete("/:id", authMiddleware, articleController.deleteArticle);

router.put("/:id", authMiddleware, articleController.updateArticle);

router.put("/:id/like", authMiddleware, articleController.likeArticle);

module.exports = router;

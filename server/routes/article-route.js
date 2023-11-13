const router = require("express").Router();
const articleController = require("../controllers/article-controller");

router.get("/boards", articleController.getAllBoards);

router.get("/", articleController.getArticles);

router.post("/", articleController.createArticle);

router.get("/get-presigned-url", articleController.uploadImageToS3);

module.exports = router;

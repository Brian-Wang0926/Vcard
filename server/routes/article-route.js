const router = require("express").Router();
const articleController = require("../controllers/article-controller");

router.get("/boards", articleController.getAllBoards);

router.post("/", articleController.createArticle);

router.get("/", articleController.getArticles);

module.exports = router;

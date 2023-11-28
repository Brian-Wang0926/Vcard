const router = require("express").Router();
const commentController = require("../controllers/comment-controller");
const { authMiddleware } = require("../controllers/auth-controller");

router.get("/:articleId", commentController.getCommentsByArticle);

router.post("/:articleId", authMiddleware, commentController.createComment);

router.put("/:commentId", authMiddleware, commentController.updateComment);

router.delete("/:commentId", authMiddleware, commentController.deleteComment);

router.put("/:commentId/like", authMiddleware, commentController.likeComment);

module.exports = router;

const Comment = require("../models/comment-model");
const Article = require("../models/article-model");

const createComment = async (req, res) => {
  try {
    console.log("後端建立留言");
    const { text, author, article } = req.body;
    console.log("後端建立留言", text, author, article);
    const newComment = new Comment({
      text,
      author,
      article,
    });
    await newComment.save();
    await newComment.populate("author", "name");
    console.log("後端建立留言成功", newComment);
    await Article.findByIdAndUpdate(article, { $inc: { commentCount: 1 } });
    res.status(200).json(newComment);
  } catch (e) {
    res.status(500).json({ message: "無法創建留言", e });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    console.log("後端刪留言", commentId);
    let comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "留言未找到" });
    }

    // 检查当前用户是v否是留言的作者
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: "无权限删除此留言" });
    }
    const articleId = comment.article;

    await Comment.findByIdAndRemove(commentId);
    await Article.findByIdAndUpdate(articleId, { $inc: { commentCount: -1 } });

    res.status(200).json({ message: "留言已删除" });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "删除留言时出现错误", e });
  }
};

const getCommentsByArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    console.log("後端取得留言", articleId);
    const comments = await Comment.find({ article: articleId }).populate(
      "author",
      "name"
    );
    console.log("後端取得留言成功", comments);
    res.json(comments);
  } catch (e) {
    res.status(500).json({ message: "無法獲取留言", e });
  }
};

const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const commentId = req.params.commentId;

    let comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "留言未找到" });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: "無權限更新此留言" });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json(comment);
  } catch (e) {
    res.status(500).json({ message: "更新留言时出现错误", e });
  }
};

const likeComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.userId; // 确保您已经通过认证中间件获取了userId

  try {
    let comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "评论未找到" });
    }

    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      comment.likes.push(userId);
      comment.likeCount += 1;
    } else {
      comment.likes.splice(index, 1);
      comment.likeCount -= 1;
    }

    await comment.save();
    res.json(comment);
  } catch (e) {
    res.status(500).json({ message: "处理点赞时出现错误", e });
  }
};

module.exports = {
  createComment,
  getCommentsByArticle,
  updateComment,
  deleteComment,
  likeComment
};

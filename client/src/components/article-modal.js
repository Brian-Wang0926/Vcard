import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import { useNavigate } from "react-router-dom";

import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

import LikeGray from "../icons/like_gray.svg";
import LikeRed from "../icons/like_red.svg";

import SaveButton from "./SaveButton";

import useUserStore from "../stores/userStore";

const ArticleModal = ({ articleId, onClose, onUpdate }) => {
  const { currentUser } = useUserStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null); // 正在編輯的留言
  const [editedText, setEditedText] = useState(""); // 編輯的文本
  const [articleLiked, setArticleLiked] = useState(false);
  const navigate = useNavigate();
  const [article, setArticle] = useState("");

  // 測試
  // useEffect(() => {
  //   console.log("ArticleModal 组件挂载，当前用户:", currentUser);
  //   console.log("articleLiked 更新為", articleLiked);
  //   console.log("article 更新為", article);
  // }, [articleLiked, currentUser, article]);

  // 取得文章
  useEffect(() => {
    const fetchFullArticle = async () => {
      try {
        console.log("有進入fetchFullArticle");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/article/${articleId}`,
          { headers: authServiceInstance.authHeader() }
        );
        setArticle(response.data);
        console.log("成功取得完整文章", response.data);
      } catch (error) {
        console.error("Error fetching full article:", error);
      }
    };

    if (articleId) {
      console.log("有文章id", articleId);
      fetchFullArticle();
    }
  }, [articleId]);

  // 初始化 Markdown 解析器
  const mdParser = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return ""; // 使用非高亮的代碼作為後備
    },
  });

  const renderedContent = mdParser.render(article.content || "");

  const handleModalContainerClick = (event) => {
    event.stopPropagation();
  };

  const formattedDate = moment(article.createdAt).format("YYYY-MM-DD HH:mm:ss");

  // 文章功能
  // 刪除文章
  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("確定要刪除這篇文章？刪掉就無法復原！")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/article/${articleId}`,
          { headers: authServiceInstance.authHeader() }
        );
        onClose();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  // 更新文章
  const handleEditArticle = () => {
    navigate("/post", { state: { article } });
  };

  // 文章留言功能
  // 取得留言
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/comment/${articleId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [articleId]);
  // 新增留言
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comment/${articleId}`,
        {
          text: newComment,
          author: currentUser.id,
          article: articleId,
        },
        { headers: authServiceInstance.authHeader() }
      );
      setComments([...comments, response.data]);
      setNewComment("");

      const updatedArticle = {
        ...article,
        commentCount: article.commentCount + 1,
      };
      console.log("留言updatedArticle", updatedArticle);
      setArticle(updatedArticle);
      onUpdate(updatedArticle);
      console.log("新增留言成功");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  // 更新留言
  const handleUpdateComment = async (commentId) => {
    if (!editedText.trim()) return;
    if (!currentUser) return;
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/comment/${commentId}`,
        { text: editedText },
        { headers: authServiceInstance.authHeader() }
      );

      // 更新留言列表
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? { ...comment, text: editedText } : comment
        )
      );
      setEditingCommentId(null);
      setEditedText("");
      console.log("更新留言成功");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  // 刪除留言
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/comment/${commentId}`,
        { headers: authServiceInstance.authHeader() }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
      const updatedArticle = {
        ...article,
        commentCount: article.commentCount - 1,
      };
      console.log("留言updatedArticle", updatedArticle);
      setArticle(updatedArticle);
      onUpdate(updatedArticle);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // 文章愛心功能
  useEffect(() => {
    if (currentUser && article) {
      const isLiked = article.likes && article.likes.includes(currentUser.id);
      setArticleLiked(isLiked);
    }
  }, [article, currentUser]);

  const toggleLikeArticle = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/article/${articleId}/like`,
        {},
        { headers: authServiceInstance.authHeader() }
      );
      console.log(
        "前端點擊愛心傳送api回傳",
        response.data.likes.includes(currentUser.id)
      );
      setArticleLiked(response.data.likes.includes(currentUser.id));

      const updatedArticle = { ...article, likes: response.data.likes };
      setArticle(updatedArticle);
      onUpdate(updatedArticle);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const HeartButton = () => (
    <img
      src={currentUser && articleLiked ? LikeRed : LikeGray}
      onClick={currentUser ? toggleLikeArticle : null}
      alt="like button"
      className="h-6 w-6 mx-2 cursor-pointer"
    />
  );

  // 留言愛心功能
  const toggleLikeComment = async (commentId) => {
    if (!currentUser) return;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/comment/${commentId}/like`,
        {},
        { headers: authServiceInstance.authHeader() }
      );

      // 更新评论列表中的点赞信息
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: response.data.likes,
                likeCount: response.data.likeCount,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("处理点赞时出现错误:", error);
    }
  };

  const CommentHeartButton = ({ comment, toggleLike }) => (
    <img
      src={
        currentUser && comment.likes.includes(currentUser.id)
          ? LikeRed
          : LikeGray
      }
      onClick={() => toggleLike(comment._id)}
      alt="like button"
      className="h-6 w-6 mx-2 cursor-pointer"
    />
  );

  if (!article) {
    return <div>Loading article...</div>;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>

      <div
        className="fixed inset-0 z-20 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="w-3/4 h-full bg-white pt-6 pr-0 pb-6 rounded shadow-lg relative flex flex-col"
          onClick={handleModalContainerClick} //阻止事件冒泡
        >
          <button
            className="absolute top-0 right-6 text-black hover:text-gray-700"
            onClick={onClose}
          >
            <span className="text-2xl">&times;</span>
          </button>

          {currentUser && article.author._id === currentUser.id && (
            <div className="absolute top-0 right-10">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-0.5 rounded mr-2 text-xs"
                onClick={() => handleEditArticle()}
              >
                編輯
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold p-0.5 rounded mr-2 text-xs"
                // onClick={handleDeleteArticle}
                onClick={() => handleDeleteArticle(articleId)}
              >
                刪除
              </button>
            </div>
          )}

          {/* 文章內容區域 */}
          <div className="overflow-auto mb-10 ">
            <div className="ml-6 min-h-[75vh]">
              <div>{article.author.name}</div>
              <div className="text-2xl font-semibold my-4">{article.title}</div>
              <div>
                {article.board.name} / {formattedDate}
              </div>
              <hr className="my-4 mr-2"></hr>
              <div
                dangerouslySetInnerHTML={{ __html: renderedContent }}
                className="prose custom-html-style"
              ></div>
            </div>

            {/* 留言顯示區域 */}
            <div className=" bg-gray-100 p-6">
              {comments.map((comment, index) => (
                <div
                  key={comment._id}
                  className={`p-2 ${
                    index < comments.length - 1
                      ? "border-b border-gray-300"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    {/* 姓名時間 */}
                    <div>
                      <span className="font-bold">{comment.author.name}</span>
                      <span className="mx-2">|</span>
                      <span>
                        {moment(comment.createdAt).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </span>
                    </div>
                    {/* 編輯按鈕 */}
                    <div className="flex items-center ml-auto">
                      {currentUser && currentUser.id === comment.author._id && (
                        <>
                          {editingCommentId === comment._id ? (
                            <>
                              <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold p-1 rounded mr-2 text-xs"
                                onClick={() => handleUpdateComment(comment._id)}
                              >
                                保存
                              </button>
                              <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold p-1 rounded text-xs"
                                onClick={() => setEditingCommentId(null)}
                              >
                                取消
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded mr-2 text-xs"
                                onClick={() => {
                                  setEditingCommentId(comment._id);
                                  setEditedText(comment.text);
                                }}
                              >
                                編輯
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded text-xs"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                刪除
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {/* 留言愛心 */}
                    <div className="flex items-center">
                      <span className="mx-3 min-w-[3em] text-right">
                        {comment.likeCount}
                      </span>
                      <CommentHeartButton
                        comment={comment}
                        toggleLike={toggleLikeComment}
                      />
                    </div>
                  </div>

                  {editingCommentId === comment._id ? (
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full mt-2"
                    ></textarea>
                  ) : (
                    <div className="mt-2">{comment.text}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 留言輸入區域 */}
          <div className="flex items-center justify-between absolute bottom-0 left-0 w-full bg-white px-6 py-4 shadow-lg">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border-2 border-gray-200 rounded mr-4"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 flex-none"
            >
              Send
            </button>
            <HeartButton />
            <SaveButton articleId={articleId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleModal;

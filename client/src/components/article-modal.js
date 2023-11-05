import React from "react";
import moment from "moment";

const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  // 防止点击模态框内容时事件冒泡到覆盖层
  const handleModalContainerClick = (event) => {
    event.stopPropagation();
  };

  const formattedDate = moment(article.createdAt).format("YYYY-MM-DD HH:mm:ss");

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-10"
        onClick={onClose}
      ></div>

      <div
        className="fixed inset-0 z-20 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-3/4 max-h-[100vh] bg-white p-6 rounded shadow-lg relative overflow-hidden"
          onClick={handleModalContainerClick}
        >
          <button
            onClick={onClose}
            className="absolute top-0 right-2 mt-2 mr-2 text-black hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
          {/* 文章內容 */}
          <div>{article.author?.name}</div>
          <h2 className="text-xl font-semibold my-4">{article.title}</h2>
          <div>{article.board?.name} / {formattedDate}</div>
          <hr className="my-2"></hr>
          <div className="overflow-auto max-h-[calc(100vh-150px)]">
            <p className="mb-4">{article.content}</p>
            {article.mediaUrls?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Article ${index}`}
                className="mb-4 max-w-full h-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleModal;

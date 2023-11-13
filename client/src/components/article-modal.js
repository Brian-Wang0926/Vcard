import React from "react";
import moment from "moment";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

const ArticleModal = ({ article, onClose }) => {
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
  const renderedContent = mdParser.render(article.content);

  const handleModalContainerClick = (event) => {
    event.stopPropagation();
  };

  const formattedDate = moment(article.createdAt).format("YYYY-MM-DD HH:mm:ss");
  if (!article) return null;
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
          <div>
            {article.board?.name} / {formattedDate}
          </div>
          <hr className="my-2"></hr>
          <div className="overflow-auto max-h-[calc(100vh-150px)]">
            <div
              className="prose custom-html-style"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            ></div>
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

import React from "react";
import moment from "moment";
import LikeRed from "../icons/like_red.svg";
import message from "../icons/message.svg";
import SaveButton from "./SaveButton";
import useUserStore from "../stores/userStore";

const Article = ({ article, onArticleClick }) => {
  const { savedArticles } = useUserStore();
  const isArticleSaved = savedArticles.has(article._id);

  const formattedDate = moment(article.createdAt).format("YYYY-MM-DD HH:mm:ss");

  return (
    <div
      className="cursor-pointer bg-gray-200 hover:bg-gray-400 p-4 my-4 rounded transition-colors duration-200 ease-in-out flex justify-between items-center space-x-4"
      onClick={() => onArticleClick(article)}
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm text-gray-700 py-1">
          {article.board.name} / {formattedDate}
        </div>
        <div className="text-lg truncate ...">{article.title}</div>
        <div className="text-sm truncate ...">{article.content}</div>
        <div className="flex items-center text-sm text-gray-500 mt-2 overflow-hidden">
          <img src={LikeRed} alt="like button" className="h-4 w-4 mr-2" />
          <span className="truncate mr-3">{article.likes.length}</span>
          <img src={message} alt="message" className="h-4 w-4 mr-2" />
          <span className="truncate mr-3">{article.commentCount}</span>
          <SaveButton articleId={article._id} isSaved={isArticleSaved} />
        </div>
      </div>
      {article.firstImageUrl && (
        <div className="relative w-24 h-24 overflow-hidden rounded-lg">
          <img
            src={article.firstImageUrl}
            alt="Article preview"
            className="absolute object-cover w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      )}
    </div>
  );
};

export default Article;

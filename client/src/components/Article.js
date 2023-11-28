import React from "react";
import moment from "moment";
import LikeRed from "../icons/like_red.svg";
import message from "../icons/message.svg";
import SaveButton from "./SaveButton";
import useArticleSave from "../hooks/useArticleSave";

const Article = ({ article, currentUser, setCurrentUser, onArticleClick }) => {
  const { isArticleSaved, handleSave } = useArticleSave(
    article._id,
    currentUser,
    setCurrentUser
  );
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = article.content.match(imageRegex);
  const firstImageUrl = match ? match[1] : null;
  const textWithoutImages = article.content.replace(imageRegex, "");
  const previewText = textWithoutImages.slice(0, 150);
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
        <div className="text-lg">{article.title}</div>
        <div className="text-sm truncate ...">{previewText}</div>
        <div className="flex items-center text-sm text-gray-500 mt-2 overflow-hidden">
          <img src={LikeRed} alt="like button" className="h-4 w-4 mr-2" />
          <span className="truncate mr-3">{article.likes.length}</span>
          <img src={message} alt="message" className="h-4 w-4 mr-2" />
          <span className="truncate mr-3">{article.commentCount}</span>
          <SaveButton
            isSaved={isArticleSaved}
            onSave={(event) => handleSave(event, article._id)}
          />
        </div>
      </div>
      {firstImageUrl && (
        <div className="relative w-24 h-24 overflow-hidden rounded-lg">
          <img
            src={firstImageUrl}
            alt="Article preview"
            className="absolute object-cover w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      )}
    </div>
  );
};

export default Article;

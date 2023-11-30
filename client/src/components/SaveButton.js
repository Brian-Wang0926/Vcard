import React from "react";
import useUserStore from "../stores/userStore";
import { handleSaveArticle } from "../utils/articleUtils";
import saveGray from "../icons/save-gray.svg";
import saveBlue from "../icons/save-blue.svg";

// 收藏文章
const SaveButton = ({ articleId }) => {
  const { savedArticles } = useUserStore();
  // console.log("收藏的文章id", articleId);
  // console.log("收藏的文章savedArticles", savedArticles);
  const isSaved = savedArticles.has(articleId);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    handleSaveArticle(articleId);
  };

  return (
    <img
      src={isSaved ? saveBlue : saveGray}
      alt="Save Button"
      className="cursor-pointer"
      onClick={handleSaveClick}
    />
  );
};

export default SaveButton;

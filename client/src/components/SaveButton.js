import React from "react";
import useUserStore from "../stores/userStore";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import saveGray from "../icons/save-gray.svg";
import saveBlue from "../icons/save-blue.svg";

// 收藏文章
const SaveButton = ({ articleId }) => {
  const { currentUser, savedArticles, toggleSavedArticle } = useUserStore();
  const isSaved = savedArticles.has(articleId);
  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile/save-article`,
        { articleId },
        { headers: authServiceInstance.authHeader() }
      );

      if (response.data) {
        toggleSavedArticle(articleId);
      }
    } catch (error) {
      console.error("收藏文章時發生錯誤:", error);
    }
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

import axios from "axios";
import authServiceInstance from "../services/auth-service";

export const handleSaveArticle = async (
  articleId,
  event,
  currentUser,
  setCurrentUser
) => {
  event.stopPropagation();
  try {
    console.log("收藏文章前端axios到後端");
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/profile/save-article`,
      { articleId },
      { headers: authServiceInstance.authHeader() }
    );
    if (response.data) {
      const isArticleSaved = response.data.savedArticles.includes(articleId);
      console.log("資料庫回傳", response.data.savedArticles);
      if (setCurrentUser) {
        setCurrentUser({
          ...currentUser,
          savedArticles: response.data.savedArticles,
        });
        return isArticleSaved;
      }
    }
    console.log("前端文章成功儲存");
  } catch (error) {
    console.error("收藏文章時發生錯誤:", error);
    return false;
  }
};

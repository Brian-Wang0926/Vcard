import axios from "axios";
import authServiceInstance from "../services/auth-service";
import useUserStore from "../stores/userStore";

export const handleSaveArticle = async (articleId) => {
  const { toggleSavedArticle } = useUserStore.getState();

  try {
    console.log("收藏文章前端axios到後端", articleId);
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/profile/save-article`,
      { articleId },
      { headers: authServiceInstance.authHeader() }
    );

    if (response.data) {
      toggleSavedArticle(articleId);
    }
    console.log("前端文章成功儲存", response.data);
  } catch (error) {
    console.error("收藏文章時發生錯誤:", error);
    return false;
  }
};

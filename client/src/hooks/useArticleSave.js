import { useState, useEffect } from "react";
import { handleSaveArticle } from "../utils/articleUtils";

const useArticleSave = (articleId, currentUser, setCurrentUser) => {
  // Ensure that savedArticles is always an array
  const savedArticles = currentUser?.savedArticles || [];

  const [isArticleSaved, setIsArticleSaved] = useState(
    savedArticles.includes(articleId)
  );

  useEffect(() => {
    // Update the state based on the current user's savedArticles
    setIsArticleSaved(
      (currentUser?.savedArticles || []).includes(articleId)
    );
  }, [currentUser, articleId]);

  const handleSave = async (event) => {
    event.stopPropagation();
    if (currentUser) {
      const isSavedNow = await handleSaveArticle(
        articleId,
        event,
        currentUser,
        setCurrentUser
      );
      setIsArticleSaved(isSavedNow);
    }
  };

  return { isArticleSaved, handleSave };
};

export default useArticleSave;
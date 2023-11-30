import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import ArticleModal from "./article-modal";
import Article from "./Article";
import useUserStore from "../stores/userStore";

const ArticleListComponent = ({
  board,
  articles: providedArticles,
  showOnlySaved = false,
}) => {
  const [articles, setArticles] = useState(providedArticles || []);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUserStore();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (showOnlySaved && currentUser && currentUser.savedArticles) {
        response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/save-article`, { headers: authServiceInstance.authHeader() });
        setArticles(response.data.savedArticles);
      } else {
        const endpoint = board ? `${process.env.REACT_APP_API_URL}/api/article?board=${board._id}` : `${process.env.REACT_APP_API_URL}/api/article`;
        response = await axios.get(endpoint);
        setArticles(response.data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  }, [board, providedArticles, showOnlySaved, currentUser]);


  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    fetchArticles();
  };

  const updateArticleInList = (updatedArticle) => {
    setArticles(prevArticles => prevArticles.map(article => 
      article._id === updatedArticle._id ? updatedArticle : article
    ));
  };

  const handleEditArticle = (article) => {
    navigate("/post", { state: { article } });
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("確定要刪除這篇文章？刪掉就無法復原！")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/article/${articleId}`,
          { headers: authServiceInstance.authHeader() }
        );
        setArticles(prevArticles => prevArticles.filter(article => article._id !== articleId));
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white py-3 px-4 overflow-y-auto h-[calc(100vh-70px)]">
      <h2 className="text-xl font-bold my-4">
        {board ? board.name : "所有文章"}
      </h2>

      {articles.length > 0 ? (
        <div>
          {articles.map((article) => (
            <Article
              key={article._id}
              article={article}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onArticleClick={handleArticleClick}
            />
          ))}
          {selectedArticle && (
            <ArticleModal
              article={selectedArticle}
              onClose={handleCloseModal}
              currentUser={currentUser}
              updateArticleInList={updateArticleInList}
              onEditArticle={handleEditArticle}
              onDeleteArticle={handleDeleteArticle}
            />
          )}
        </div>
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
};

export default ArticleListComponent;

import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import ArticleModal from "./article-modal";
import Article from "./Article";
import useUserStore from "../stores/userStore";

const ArticleListComponent = ({ board, showOnlySaved = false }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const { currentUser } = useUserStore();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = `${
        process.env.REACT_APP_API_URL
      }/api/article?limit=10&page=${page}${board ? "&board=" + board._id : ""}`;
      const response = await axios.get(endpoint, {
        headers: authServiceInstance.authHeader(),
      });
      if (response.data.length > 0) {
        setArticles((prev) => [...prev, ...response.data]);
        console.log("前端接收預覽文章", response.data);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  }, [board, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles, page]);

  const handleObserver = useCallback(
    (entities) => {
      const target = entities[0];
      if (target.isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const handleArticleClick = (articleId) => {
    setSelectedArticleId(articleId);
  };

  const handleCloseModal = () => {
    setSelectedArticleId(null);
  };

  const updateArticleInList = (updatedArticle) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === updatedArticle._id ? updatedArticle : article
      )
    );
  };

  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white py-3 px-4 overflow-y-auto h-[calc(100vh-70px)]">
      <h2 className="text-xl font-bold my-4">
        {board ? board.name : "所有文章"}
      </h2>

      {articles.length > 0 ? (
        <div>
          {articles.map((articlePreview) => (
            <Article
              key={articlePreview._id}
              article={articlePreview}
              onArticleClick={() => handleArticleClick(articlePreview._id)}
            />
          ))}
          <div ref={loader} />
          {selectedArticleId && (
            <ArticleModal
              articleId={selectedArticleId}
              onClose={handleCloseModal}
              currentUser={currentUser}
              updateArticleInList={updateArticleInList}
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

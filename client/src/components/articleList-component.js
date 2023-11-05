import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleModal from "./article-modal";

const ArticleListComponent = ({ board }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const endpoint = board
          ? `/api/article?board=${board._id}`
          : "/api/article";
        const response = await axios.get(endpoint);
        setArticles(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [board]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white py-3 px-5 overflow-y-auto h-[calc(100vh-56px)]">
      <h2 className="text-xl font-bold my-4">
        {board ? board.name : "所有文章"}
      </h2>

      {articles.length > 0 ? (
        <div>
          {articles.map((article) => (
            <div
              key={article._id}
              className="cursor-pointer hover:bg-gray-200 p-4 my-4 rounded transition-colors duration-200 ease-in-out"
              onClick={() => handleArticleClick(article)}
            >
              {" "}
              {article.title}{" "}
            </div>
          ))}
          {selectedArticle && (
            <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
          )}
        </div>
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
};

export default ArticleListComponent;

import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import ArticleModal from "./article-modal";
import Article from "./Article";
import useUserStore from "../stores/userStore";
import { fetchSavedArticles } from "../utils/sharedFunctions";
import { ReactComponent as ArrowUpIcon } from "../icons/top_arrow.svg";

const ArticleListComponent = ({
  board,
  showOnlyUserArticles,
  showOnlySavedArticles,
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const scrollContainerRef = useRef(null);

  const { currentUser } = useUserStore();
  const { savedArticles } = useUserStore.getState();

  const fetchArticles = useCallback(
    async (reset = false) => {
      if (reset) {
        setArticles([]); // 重置文章列表
        setPage(1); // 从第二页开始加载
      }

      setLoading(true);
      // 获取保存的文章 ID
      try {
        let params = new URLSearchParams({
          limit: 6,
          page: reset ? 1 : page,
        });

        if (board) {
          params.append("board", board._id);
        } else if (showOnlyUserArticles && currentUser?.id) {
          params.append("authorId", currentUser.id);
        } else if (showOnlySavedArticles) {
          params.append("savedArticleIds", Array.from(savedArticles).join(","));
        }

        const endpoint = `${
          process.env.REACT_APP_API_URL
        }/api/article?${params.toString()}`;

        console.log("fetchArticles 發送api", endpoint);
        const response = await axios.get(endpoint, {
          headers: authServiceInstance.authHeader(),
        });
        const newArticles = response.data;

        if (newArticles.length > 0) {
          setArticles((prevArticles) =>
            reset ? [...newArticles] : [...prevArticles, ...newArticles]
          );
          setHasMore(true);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      board,
      currentUser?.id,
      savedArticles,
      showOnlySavedArticles,
      showOnlyUserArticles,
    ]
  );

  useEffect(() => {
    console.log("開始");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0; // 滚动到容器顶部
    }

    fetchArticles(true);

    // eslint-disable-next-line
  }, [board, showOnlySavedArticles, showOnlyUserArticles]);

  //  文章收藏
  useEffect(() => {
    if (currentUser) {
      fetchSavedArticles().then((savedArticles) => {
        const articleIds = savedArticles.map((article) => article._id);
        useUserStore.getState().setSavedArticles(articleIds);
      });
    }
  }, [currentUser]);

  // 滑動至底部載入文章
  useEffect(() => {
    if (articles.length < 6) {
      // 如果文章数量少于6篇，则不创建 IntersectionObserver
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    };

    const observerCallback = (entries, observer) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        fetchArticles();
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const currentLoader = loader.current; // 本地变量来持有 ref

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, articles.length, fetchArticles]);

  const handleArticleClick = (articleId) => {
    setSelectedArticleId(articleId);
  };

  const handleCloseModal = () => {
    setSelectedArticleId(null);
    fetchArticles(true);
  };

  const handleUpdate = (updatedArticle) => {
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
    <div
      className="bg-white py-3 px-4 overflow-y-auto h-[calc(100vh-70px)]"
      ref={scrollContainerRef}
    >
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
          {selectedArticleId && (
            <ArticleModal
              articleId={selectedArticleId}
              onClose={handleCloseModal}
              currentUser={currentUser}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      ) : (
        <p>No articles found.</p>
      )}

      <div ref={loader} className="h-18 bg-gray-200" />
      <button
        className="fixed right-5 bottom-5 z-50 bg-transparent border-none cursor-pointer opacity-30 hover:opacity-100"
        onClick={() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }}
      >
        <ArrowUpIcon className="w-7 h-7" />
      </button>
    </div>
  );
};

export default ArticleListComponent;

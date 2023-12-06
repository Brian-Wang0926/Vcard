import { create } from "zustand";

const useUserStore = create((set) => ({
  // 使用者狀態
  currentUser: null,
  authChecked: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthChecked: (checked) => set({ authChecked: checked }),

  // 文章儲存狀態
  savedArticles: new Set(),
  setSavedArticles: (articleIds) => set({ savedArticles: new Set(articleIds) }),
  toggleSavedArticle: (articleId) =>
    set((state) => {
      const newSaved = new Set(state.savedArticles);
      if (newSaved.has(articleId)) {
        newSaved.delete(articleId);
      } else {
        newSaved.add(articleId);
      }
      return { savedArticles: newSaved };
    }),

  // 訂閱看版
  subscribedBoards: new Set(), // 存储用户订阅的看板ID
  setSubscribedBoards: (boardIds) =>
    set({ subscribedBoards: new Set(boardIds) }),
  toggleSubscribedBoard: (boardId) =>
    set((state) => {
      const newSubscribed = new Set(state.subscribedBoards);
      if (newSubscribed.has(boardId)) {
        newSubscribed.delete(boardId);
      } else {
        newSubscribed.add(boardId);
      }
      return { subscribedBoards: newSubscribed };
    }),
}));

export default useUserStore;

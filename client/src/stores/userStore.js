import { create } from "zustand";

const useUserStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  savedArticles: new Set(),
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
}));

export default useUserStore;

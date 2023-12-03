import { create } from "zustand";

const useUserStore = create((set) => ({
  currentUser: null,
  authChecked: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthChecked: (checked) => set({ authChecked: checked }),
  
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
}));

export default useUserStore;

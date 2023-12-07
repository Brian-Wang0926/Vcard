import { create } from "zustand";

const useSearchStore = create((set) => ({
  searchTerm: "", // 搜索關鍵詞
  searchResults: [], // 搜索結果
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchResults: (results) => set({ searchResults: results }),
}));

export default useSearchStore;
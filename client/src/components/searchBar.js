import React from "react";
import useSearchStore from "../stores/searchStore";
import axios from "axios";

const SearchBar = () => {
  const { searchTerm, setSearchTerm, setSearchResults } = useSearchStore();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search`,
        { params: { searchTerm } }
      );

      if (response.status === 200) {
        setSearchResults(response.data); // 更新搜索結果狀態
      }
    } catch (error) {
      console.error("搜索錯誤:", error);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;

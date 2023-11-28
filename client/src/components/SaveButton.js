import React from "react";
import saveGray from "../icons/save-gray.svg";
import saveBlue from "../icons/save-blue.svg";

// 收藏文章
const SaveButton = ({ isSaved, onSave }) => {
  return (
    <img
      src={isSaved ? saveBlue : saveGray}
      alt="Save Button"
      className="cursor-pointer"
      onClick={onSave}
    />
  );
};

export default SaveButton;
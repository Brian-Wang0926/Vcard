import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../stores/userStore";

const RequireAuth = ({ children }) => {
  const { currentUser, authChecked } = useUserStore();

  if (!authChecked) {
    return null; // 或者返回一个加载组件
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAuth;

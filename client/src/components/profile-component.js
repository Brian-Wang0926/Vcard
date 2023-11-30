import React, { useState, useEffect, useCallback } from "react";
import authServiceInstance from "../services/auth-service";
import moment from "moment-timezone";
import axios from "axios";
import ArticleListComponent from "./articleList-component";
import useUserStore from "../stores/userStore";

const ProfileComponent = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [userArticles, setUserArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const { currentUser, setCurrentUser } = useUserStore();

  // 使用 moment-timezone 轉換時間為 UTC+8
  const formatAsUTC8 = (dateString) => {
    return moment(dateString).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
  };

  const fetchUserArticles = useCallback(async () => {
    if (currentUser?.id) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/article/user`,
          { headers: authServiceInstance.authHeader() }
        );
        console.log("我的文章", currentUser?.id, response.data);
        setUserArticles(response.data);
      } catch (error) {
        console.error("Error fetching user articles:", error);
      }
    }
  }, [currentUser?.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (currentUser && currentUser.token) {
          const response = await authServiceInstance.getUserProfile();
          if (response && response.data) {
            // 更新用戶資料狀態
            setUserProfile(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [currentUser, activeTab, fetchUserArticles]);

  const renderContent = () => {
    if (!currentUser) {
      return <div>在獲取您的個人資料之前，您必須先登錄。</div>;
    }

    switch (activeTab) {
      case "profile":
        return renderProfileSection();
      case "posts":
        return (
          <ArticleListComponent
            articles={userArticles}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        );
      case "save":
        return (
          <ArticleListComponent
            articles={savedArticles}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            showOnlySaved
          />
        );
      default:
        return <div>請選擇一個選項</div>;
    }
  };

  const renderProfileSection = () => {
    if (userProfile) {
      return (
        <div className="m-4">
          <div className="text-xl font-bold mb-4">個人檔案：</div>
          <table className="min-w-full table-auto border-collapse">
            <tbody>
              <tr className="border-t">
                <td className="py-2 flex justify-center my-6">
                  <img
                    src={userProfile.thumbnail}
                    alt="使用者頭像"
                    className="rounded-full w-32 h-32 object-cover"
                  />
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">
                  <strong className="font-semibold">
                    姓名：{userProfile.name}
                  </strong>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">
                  <strong className="font-semibold">
                    ID: {userProfile._id}
                  </strong>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">
                  <strong className="font-semibold">
                    電子信箱: {userProfile.email}
                  </strong>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2">
                  <strong className="font-semibold">
                    上次登入: {formatAsUTC8(userProfile.lastActiveDate)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return <div>Loading...</div>;
  };

  const fetchSavedArticles = useCallback(async () => {
    try {
      console.log("開始fetchSavedArticles");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/profile/save-article`,
        { headers: authServiceInstance.authHeader() }
      );
      console.log("後端收藏文章123", response.data.savedArticles);
      setSavedArticles(response.data.savedArticles);
    } catch (error) {
      console.error("Error fetching saved articles:", error);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "posts" && currentUser) {
      fetchUserArticles();
    } else if (activeTab === "save" && currentUser) {
      fetchSavedArticles();
    }
  }, [currentUser, activeTab, fetchUserArticles, fetchSavedArticles]);

  return (
    <div className="flex pt-14 max-w-screen-xl mx-auto overflow-hidden h-screen">
      <aside className="w-1/4 bg-gray-100">
        <ul className="space-y-2">
          <li
            className={`p-2 cursor-pointer ${
              activeTab === "profile" ? "bg-gray-800 text-white" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            個人檔案
          </li>
          <li
            className={`p-2 cursor-pointer ${
              activeTab === "posts" ? "bg-gray-800 text-white" : ""
            }`}
            onClick={() => setActiveTab("posts")}
          >
            文章管理
          </li>
          <li
            className={`p-2 cursor-pointer ${
              activeTab === "save" ? "bg-gray-800 text-white" : ""
            }`}
            onClick={() => setActiveTab("save")}
          >
            我的收藏
          </li>
        </ul>
      </aside>
      <main className="w-3/4 overflow-hidden">{renderContent()}</main>
    </div>
  );
};

export default ProfileComponent;

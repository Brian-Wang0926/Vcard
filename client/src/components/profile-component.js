import React, { useState, useEffect } from "react";
import authServiceInstance from "../services/auth-service";
import moment from "moment-timezone";
import ArticleListComponent from "./articleList-component";
import useUserStore from "../stores/userStore";

const ProfileComponent = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { currentUser } = useUserStore();

  // 使用 moment-timezone 轉換時間為 UTC+8
  const formatAsUTC8 = (dateString) => {
    return moment(dateString).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser && currentUser.token) {
        try {
          const response = await authServiceInstance.getUserProfile();
          setUserProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSection();
      case "posts":
        return <ArticleListComponent showOnlyUserArticles={true} />;
      case "save":
        return <ArticleListComponent showOnlySavedArticles={true} />;
      default:
        return <div>请选择一个选项</div>;
    }
  };

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

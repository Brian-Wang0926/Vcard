import React, { useState, useEffect } from "react";
import authServiceInstance from "../services/auth-service";
import moment from "moment-timezone";

const ProfileComponent = ({ currentUser }) => {
  const [userProfile, setUserProfile] = useState(null);

  // 使用 moment-timezone 轉換時間為 UTC+8
  const formatAsUTC8 = (dateString) => {
    return moment(dateString).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
  };

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
  }, [currentUser]);

  return (
    <div className="p-20">
      {!currentUser && <div>在獲取您的個人資料之前，您必須先登錄。</div>}

      {userProfile ? (
        <div>
          <h2 className="text-xl font-bold mb-4">以下是您的個人檔案：</h2>

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
      ) : (
        <div>正在加載您的個人資料...</div>
      )}
    </div>
  );
};

export default ProfileComponent;

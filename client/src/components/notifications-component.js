import React from "react";
import useNotificationStore from "../stores/notificationStore";

const NotificationsComponent = () => {
  const {
    notifications,
    clearNotifications,
    setNotificationSelectedArticleId,
  } = useNotificationStore();

  const handleNotificationClick = (notification) => {
    console.log("顯示notification", notification.articleId);
    setNotificationSelectedArticleId(notification.articleId);
  };
  const reversedNotifications = [...notifications].reverse();

  return (
    <div className="absolute top-full right-0 mt-2 py-2 w-96 bg-white  rounded-lg shadow-2xl">
      <div className="flex flex-col justify-between h-full">
        <div>
          {reversedNotifications.length === 0 ? (
            <div className="px-4 py-2 text-gray-700"> No Notifications</div>
          ) : (
            reversedNotifications.map((notification, index) => (
              <div
                key={index}
                className="px-4 py-2 my-2 text-gray-700 hover:bg-gray-200 cursor-pointer "
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.message}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end px-4">
          <button
            onClick={clearNotifications}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded ml-4 text-xs"
          >
            clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsComponent;

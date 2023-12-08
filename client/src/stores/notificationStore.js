import { create } from "zustand";

const getStoredNotifications = () => {
  const stored = localStorage.getItem("notifications");
  console.log("zus從localStorage取得notifications")
  return stored ? JSON.parse(stored) : [];
};

const useNotificationStore = create((set) => ({
  notifications: getStoredNotifications(),
  addNotification: (notification) =>
    set((state) => {
      const newNotifications = [...state.notifications, notification];
      localStorage.setItem("notifications", JSON.stringify(newNotifications));
      console.log("zus從localStorage建立notifications")
      return { notifications: newNotifications };
    }),
  clearNotifications: () => {
    localStorage.removeItem("notifications");
    set({ notifications: [] });
  },
  notificationSelectedArticleId: null,
  setNotificationSelectedArticleId: (id) =>
    set({ notificationSelectedArticleId: id }),
  clearNotificationSelectedArticleId: () =>
    set({ notificationSelectedArticleId: null }),
}));

export default useNotificationStore;

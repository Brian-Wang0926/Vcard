import { create } from "zustand";

const getStoredNotifications = () => {
  const stored = localStorage.getItem("notifications");
  return stored ? JSON.parse(stored) : [];
};

const useNotificationStore = create((set) => ({
  notifications: getStoredNotifications(),
  addNotification: (notification) =>
    set((state) => {
      const newNotifications = [...state.notifications, notification];
      localStorage.setItem("notifications", JSON.stringify(newNotifications));
      return { notifications: newNotifications };
    }),
  clearNotifications: () => {
    localStorage.removeItem("notifications");
    set({ notifications: [] });
  },
  notificationSelectedArticleId: null,
  setNotificationSelectedArticleId: (id) => set({ notificationSelectedArticleId: id }),
}));

export default useNotificationStore;

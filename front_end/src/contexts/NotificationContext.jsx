import React, { createContext, useContext, useState } from "react";
import ModernNotification from "../components/ModernNotification";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      show: true,
    };
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const showSuccess = (message, duration = 5000) => {
    return addNotification({ type: "success", message, duration });
  };

  const showError = (message, duration = 7000) => {
    return addNotification({ type: "error", message, duration });
  };

  const showWarning = (message, duration = 5000) => {
    return addNotification({ type: "warning", message, duration });
  };

  const showInfo = (message, duration = 5000) => {
    return addNotification({ type: "info", message, duration });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <ModernNotification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

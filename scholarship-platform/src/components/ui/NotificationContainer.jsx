import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNotification } from '../../contexts/NotificationContext';
import '../../styles/components.css';

const NotificationItem = ({ notification, onRemove }) => {
  const typeMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  useEffect(() => {
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div className={`notification notification-${notification.type} animate-slide-right`}>
      <div className="notification-icon">{typeMap[notification.type]}</div>
      <div className="notification-message">{notification.message}</div>
      <button className="notification-close" onClick={onRemove}>
        ✕
      </button>
    </div>
  );
};

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return ReactDOM.createPortal(
    <div className="notification-container">
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          notification={notif}
          onRemove={() => removeNotification(notif.id)}
        />
      ))}
    </div>,
    document.body
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';

export const NotificationsPanel: React.FC = () => {
  const { 
    state, 
    toggleNotifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    unreadNotificationCount,
    setSelectedInvoice,
  } = useApp();
  
  if (!state.isNotificationsOpen) return null;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-50';
      case 'warning': return 'text-yellow-500 bg-yellow-50';
      case 'error': return 'text-red-500 bg-red-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };
  
  const handleNotificationClick = (notification: typeof state.notifications[0]) => {
    markNotificationRead(notification.id);
    if (notification.link) {
      setSelectedInvoice(notification.link);
      toggleNotifications();
    }
  };
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={toggleNotifications}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 w-96 max-h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadNotificationCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-primary text-white rounded-full">
                {unreadNotificationCount}
              </span>
            )}
          </div>
          <button 
            onClick={markAllNotificationsRead}
            className="text-xs text-primary hover:text-primary-dark font-medium"
          >
            Mark all read
          </button>
        </div>
        
        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {state.notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2 block">notifications_off</span>
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            state.notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                  !notification.read ? 'bg-primary-light/30 dark:bg-primary/10' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {getNotificationIcon(notification.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button className="w-full text-center text-xs text-primary hover:text-primary-dark font-medium py-1">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

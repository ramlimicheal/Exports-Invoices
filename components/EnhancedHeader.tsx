import React from 'react';
import { useApp } from '../context/AppContext';
import { NotificationsPanel } from './NotificationsPanel';

export const EnhancedHeader: React.FC = () => {
  const { 
    state, 
    toggleSidebar, 
    toggleCommandPalette, 
    toggleNotifications,
    toggleTheme,
    unreadNotificationCount,
    setViewMode,
  } = useApp();
  
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices & Billing</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard / Invoices & Billing</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* View Mode Switcher */}
        <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${
              state.viewMode === 'list' 
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="List View (1)"
          >
            <span className="material-symbols-outlined text-[20px]">view_list</span>
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`p-1.5 rounded-md transition-colors ${
              state.viewMode === 'board' 
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="Board View (2)"
          >
            <span className="material-symbols-outlined text-[20px]">view_kanban</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-1.5 rounded-md transition-colors ${
              state.viewMode === 'calendar' 
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="Calendar View (3)"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </button>
        </div>
        
        {/* Search / Command Palette Trigger */}
        <button 
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 transition-colors w-full md:w-64"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-600 rounded">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Toggle theme"
        >
          <span className="material-symbols-outlined text-[20px]">
            {state.settings.theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>
          <NotificationsPanel />
        </div>
        
        {/* User Avatar */}
        <button className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <img 
            src={state.currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=EF4444&color=fff'}
            alt="User"
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
          />
        </button>
      </div>
    </header>
  );
};

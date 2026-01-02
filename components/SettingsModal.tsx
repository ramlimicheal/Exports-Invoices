import React from 'react';
import { useApp } from '../context/AppContext';

export const SettingsModal: React.FC = () => {
  const { state, toggleSettings, updateSettings, toggleTheme, resetState } = useApp();
  
  if (!state.isSettingsOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={toggleSettings}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
          <button 
            onClick={toggleSettings}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Appearance */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    state.settings.theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    state.settings.theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* Compact View */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact View</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Show more items with less spacing</p>
                </div>
                <button
                  onClick={() => updateSettings({ compactView: !state.settings.compactView })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    state.settings.compactView ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    state.settings.compactView ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive in-app notifications</p>
                </div>
                <button
                  onClick={() => updateSettings({ notifications: !state.settings.notifications })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    state.settings.notifications ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    state.settings.notifications ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* Email Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Alerts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive important updates via email</p>
                </div>
                <button
                  onClick={() => updateSettings({ emailAlerts: !state.settings.emailAlerts })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    state.settings.emailAlerts ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    state.settings.emailAlerts ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Regional */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Regional</h3>
            <div className="space-y-4">
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={state.settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
              
              {/* Date Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={state.settings.dateFormat}
                  onChange={(e) => updateSettings({ dateFormat: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5"
                >
                  <option value="MMM DD, YYYY">MMM DD, YYYY (Oct 24, 2025)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (24/10/2025)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (10/24/2025)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2025-10-24)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Keyboard Shortcuts</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Command Palette</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300">⌘ K</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">New Quote</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300">N</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">List View</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300">1</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Board View</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300">2</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Calendar View</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300">3</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Close Modal</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300">Esc</kbd>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div>
            <h3 className="text-sm font-semibold text-red-600 mb-4">Danger Zone</h3>
            <div className="border border-red-200 dark:border-red-900/50 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Reset all data and settings to default. This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                    resetState();
                    toggleSettings();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={toggleSettings}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

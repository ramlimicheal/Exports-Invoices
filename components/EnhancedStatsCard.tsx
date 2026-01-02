import React from 'react';
import { useApp } from '../context/AppContext';

export const EnhancedStatsCards: React.FC = () => {
  const { stats } = useApp();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
      {/* Active Quotes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">verified</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Active Quotes</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${stats.activeQuotes.amount.toLocaleString()}
          </h2>
          <p className="text-xs text-gray-400">
            from <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1 rounded font-medium">
              {stats.activeQuotes.count}
            </span> Quotes
          </p>
        </div>
      </div>
      
      {/* In-Transit Value */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">directions_boat</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">In-Transit Value</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${stats.inTransit.amount.toLocaleString()}
          </h2>
          <p className="text-xs text-gray-400">
            from <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1 rounded font-medium">
              {stats.inTransit.count}
            </span> Shipments
          </p>
        </div>
      </div>
      
      {/* Commissions (MTD) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">savings</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Commissions (MTD)</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${stats.commissions.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
          <p className="text-xs text-gray-400">
            from <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1 rounded font-medium">
              {stats.commissions.count}
            </span> Invoices
          </p>
        </div>
      </div>
      
      {/* Pending Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
        <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">schedule</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending Actions</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.pendingActions.count}
          </h2>
          <p className="text-xs text-gray-400">
            from <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1 rounded font-medium">
              {stats.pendingActions.count}
            </span> Items
          </p>
        </div>
      </div>
    </div>
  );
};

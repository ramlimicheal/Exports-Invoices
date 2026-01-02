import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ActivityFeed: React.FC = () => {
  const { state, setSelectedInvoice } = useApp();
  const [showAll, setShowAll] = useState(false);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return 'add_circle';
      case 'updated': return 'edit';
      case 'status_changed': return 'swap_horiz';
      case 'comment': return 'chat_bubble';
      case 'payment': return 'payments';
      case 'shipped': return 'local_shipping';
      case 'delivered': return 'check_circle';
      default: return 'info';
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-green-100 text-green-600';
      case 'updated': return 'bg-blue-100 text-blue-600';
      case 'status_changed': return 'bg-purple-100 text-purple-600';
      case 'comment': return 'bg-yellow-100 text-yellow-600';
      case 'payment': return 'bg-emerald-100 text-emerald-600';
      case 'shipped': return 'bg-indigo-100 text-indigo-600';
      case 'delivered': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
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
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Recent Activity</h3>
          <p className="text-[10px] text-gray-400">Latest updates across all invoices</p>
        </div>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-primary hover:text-primary-dark font-medium"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>
      
      {/* Activity List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto custom-scrollbar">
        {state.activities.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500">
            <span className="material-symbols-outlined text-4xl mb-2 block">history</span>
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          (showAll ? state.activities : state.activities.slice(0, 10)).map((activity) => (
            <div 
              key={activity.id}
              className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.userName}</span>
                    {' '}
                    <span className="text-gray-500 dark:text-gray-400">
                      {activity.description.replace(activity.userName, '').trim()}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => setSelectedInvoice(activity.invoiceId)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {activity.invoiceId}
                    </button>
                    <span className="text-[10px] text-gray-400">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

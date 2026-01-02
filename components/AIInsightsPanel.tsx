import React from 'react';
import { useApp } from '../context/AppContext';
import { Insight } from '../store';

export const AIInsightsPanel: React.FC = () => {
  const { state, dismissInsight, setActiveNav, setFilters } = useApp();
  
  // Handle insight action click
  const handleInsightAction = (insight: Insight) => {
    // Navigate based on insight type
    switch (insight.type) {
      case 'recommendation':
        // Navigate to invoices with relevant filter
        setActiveNav('Invoices & Billing');
        if (insight.title.toLowerCase().includes('cardamom')) {
          setFilters({ search: 'Cardamom' });
        }
        break;
      case 'alert':
        // Navigate to invoices with overdue filter
        setActiveNav('Invoices & Billing');
        setFilters({ status: 'Unpaid' });
        break;
      case 'prediction':
        // Navigate to analytics
        setActiveNav('Analytics');
        break;
      case 'trend':
        // Navigate to analytics
        setActiveNav('Analytics');
        break;
      default:
        setActiveNav('Dashboard');
    }
    // Dismiss the insight after action
    dismissInsight(insight.id);
  };
  
  if (state.insights.length === 0) return null;
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return 'lightbulb';
      case 'alert': return 'warning';
      case 'prediction': return 'trending_up';
      case 'trend': return 'insights';
      default: return 'auto_awesome';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'text-amber-600';
      case 'alert': return 'text-red-600';
      case 'prediction': return 'text-green-600';
      case 'trend': return 'text-blue-600';
      default: return 'text-purple-600';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">AI Insights</h3>
            <p className="text-[10px] text-gray-400">Powered by ShipNow Intelligence</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">
          {state.insights.length} Active
        </span>
      </div>
      
      {/* Insights List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {state.insights.slice(0, 4).map((insight) => (
          <div 
            key={insight.id}
            className={`p-4 ${getPriorityColor(insight.priority)} border-l-4 ${
              insight.priority === 'high' ? 'border-l-red-500' : 
              insight.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[20px] ${getTypeColor(insight.type)}`}>
                {getTypeIcon(insight.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <button 
                    onClick={() => dismissInsight(insight.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {insight.description}
                </p>
                {insight.actionable && insight.action && (
                  <button 
                    onClick={() => handleInsightAction(insight)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    {insight.action}
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      {state.insights.length > 4 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button 
            onClick={() => setActiveNav('Dashboard')}
            className="w-full text-center text-xs text-primary hover:text-primary-dark font-medium py-1"
          >
            View All {state.insights.length} Insights
          </button>
        </div>
      )}
    </div>
  );
};

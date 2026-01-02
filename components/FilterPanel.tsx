import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InvoiceStatus } from '../types';

export const FilterPanel: React.FC = () => {
  const { 
    state, 
    setFilters, 
    uniqueDestinations, 
    uniqueCommodities,
    filteredInvoices,
  } = useApp();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statuses: (InvoiceStatus | 'All')[] = ['All', 'Quote', 'Unpaid', 'In-Transit', 'Paid'];
  
  const hasActiveFilters = 
    state.filters.status !== 'All' || 
    state.filters.commodity !== 'All' || 
    state.filters.destination !== 'All' ||
    state.filters.search !== '';
  
  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      commodity: 'All',
      destination: 'All',
      amountRange: null,
      dateRange: null,
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Quick Filters */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button 
                onClick={clearAllFilters}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                Clear all
              </button>
            )}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExpanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setFilters({ status })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                state.filters.status === status
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status}
              {status !== 'All' && (
                <span className="ml-1 opacity-70">
                  ({state.invoices.filter(i => i.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
          {/* Commodity Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Commodity
            </label>
            <select
              value={state.filters.commodity}
              onChange={(e) => setFilters({ commodity: e.target.value })}
              className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5"
            >
              <option value="All">All Commodities</option>
              {uniqueCommodities.map(commodity => (
                <option key={commodity} value={commodity}>{commodity}</option>
              ))}
            </select>
          </div>
          
          {/* Destination Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Destination
            </label>
            <select
              value={state.filters.destination}
              onChange={(e) => setFilters({ destination: e.target.value })}
              className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5"
            >
              <option value="All">All Destinations</option>
              {uniqueDestinations.map(destination => (
                <option key={destination} value={destination}>{destination}</option>
              ))}
            </select>
          </div>
          
          {/* Amount Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Amount Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5"
                onChange={(e) => {
                  const min = e.target.value ? Number(e.target.value) : 0;
                  setFilters({ 
                    amountRange: { 
                      min, 
                      max: state.filters.amountRange?.max || 999999999 
                    } 
                  });
                }}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5"
                onChange={(e) => {
                  const max = e.target.value ? Number(e.target.value) : 999999999;
                  setFilters({ 
                    amountRange: { 
                      min: state.filters.amountRange?.min || 0, 
                      max 
                    } 
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Results Count */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredInvoices.length}</span> of {state.invoices.length} invoices
        </p>
      </div>
    </div>
  );
};

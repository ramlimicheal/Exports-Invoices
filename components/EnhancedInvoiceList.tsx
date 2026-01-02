import React from 'react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';
import { SortField } from '../store';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let styles = "bg-gray-100 text-gray-600";
  if (status === 'Paid') styles = "bg-green-100 text-green-700";
  if (status === 'Quote') styles = "bg-yellow-100 text-yellow-800 border border-yellow-200";
  if (status === 'In-Transit') styles = "bg-blue-100 text-blue-700 border border-blue-200";
  if (status === 'Unpaid') styles = "bg-primary-light text-primary border border-red-100";

  return (
    <span className={`${styles} text-[10px] uppercase tracking-wide px-2 py-1 rounded-md font-bold inline-block text-center min-w-[70px]`}>
      {status}
    </span>
  );
};

interface SortHeaderProps {
  field: SortField;
  label: string;
  currentField: SortField;
  direction: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const SortHeader: React.FC<SortHeaderProps> = ({ field, label, currentField, direction, onSort }) => {
  const isActive = currentField === field;
  
  return (
    <th 
      className="p-4 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (
          <span className="material-symbols-outlined text-[14px] text-primary">
            {direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
        )}
      </div>
    </th>
  );
};

export const EnhancedInvoiceList: React.FC = () => {
  const { 
    paginatedInvoices,
    filteredInvoices,
    state,
    setSelectedInvoice,
    toggleSelect,
    selectAll,
    clearSelection,
    setSort,
    setPage,
    setPageSize,
    totalPages,
    deleteSelectedInvoices,
    toggleQuoteModal,
    setFilters,
  } = useApp();
  
  const handleSort = (field: SortField) => {
    if (state.sortField === field) {
      setSort(field, state.sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'desc');
    }
  };
  
  const handleSelectAll = () => {
    if (state.selectedIds.length === filteredInvoices.length) {
      clearSelection();
    } else {
      selectAll();
    }
  };
  
  const isAllSelected = state.selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0;
  const isSomeSelected = state.selectedIds.length > 0;
  
  const handleExport = () => {
    const selectedInvoices = state.selectedIds.length > 0 
      ? state.invoices.filter(inv => state.selectedIds.includes(inv.id))
      : filteredInvoices;
    
    const csv = [
      ['ID', 'Company', 'Commodity', 'Destination', 'Issue Date', 'Due Date', 'Amount', 'Status'].join(','),
      ...selectedInvoices.map(inv => [
        inv.id,
        `"${inv.companyName}"`,
        `"${inv.commodityName}"`,
        inv.destinationCountry,
        inv.issueDate,
        inv.dueDate,
        inv.amount,
        inv.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full">
      {/* List Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trading Activity</h3>
          <p className="text-xs text-gray-400">Manage quotes and active shipments</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search buyer or commodity" 
              value={state.filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full sm:w-56 pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <button 
            onClick={toggleQuoteModal}
            className="bg-gray-900 dark:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-red-600 whitespace-nowrap transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">flash_on</span>
            Quick Quote
          </button>
        </div>
      </div>
      
      {/* Bulk Actions Bar */}
      {isSomeSelected && (
        <div className="px-5 py-3 bg-primary-light dark:bg-primary/20 border-b border-primary/20 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              {state.selectedIds.length} selected
            </span>
            <button 
              onClick={clearSelection}
              className="text-xs text-primary hover:underline"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 border border-gray-200 dark:border-gray-600"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              Export
            </button>
            <button 
              onClick={() => {
                if (confirm(`Delete ${state.selectedIds.length} invoice(s)?`)) {
                  deleteSelectedInvoices();
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1 border border-red-200 dark:border-red-900"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="p-4 font-medium w-12">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                />
              </th>
              <SortHeader field="id" label="Ref ID" currentField={state.sortField} direction={state.sortDirection} onSort={handleSort} />
              <SortHeader field="companyName" label="Buyer / Destination" currentField={state.sortField} direction={state.sortDirection} onSort={handleSort} />
              <th className="p-4 font-medium">Commodity</th>
              <SortHeader field="issueDate" label="Date" currentField={state.sortField} direction={state.sortDirection} onSort={handleSort} />
              <SortHeader field="amount" label="Total Value" currentField={state.sortField} direction={state.sortDirection} onSort={handleSort} />
              <SortHeader field="status" label="Status" currentField={state.sortField} direction={state.sortDirection} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="material-symbols-outlined text-5xl mb-3">inbox</span>
                    <p className="text-sm font-medium">No invoices found</p>
                    <p className="text-xs mt-1">Try adjusting your filters or create a new quote</p>
                    <button 
                      onClick={toggleQuoteModal}
                      className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Create Quote
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((inv) => {
                const isSelected = state.selectedInvoiceId === inv.id;
                const isChecked = state.selectedIds.includes(inv.id);
                return (
                  <tr 
                    key={inv.id} 
                    className={`border-b border-gray-50 dark:border-gray-700 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-primary-light/50 dark:bg-primary/10' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedInvoice(inv.id)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => toggleSelect(inv.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                    </td>
                    <td className="p-4 font-medium text-primary hover:underline">
                      {inv.id} 
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${inv.companyColor} ${inv.companyTextColor}`}>
                          {inv.companyInitial}
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium">{inv.companyName}</div>
                          <div className="text-xs text-gray-400">{inv.destinationCountry}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-600">
                        {inv.commodityName}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">
                      <div className="text-gray-900 dark:text-white font-medium">{inv.issueDate}</div>
                      <div className="text-xs text-gray-400">{inv.dueDate}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">${inv.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredInvoices.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Show</span>
            <select
              value={state.pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>of {filteredInvoices.length} entries</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={state.currentPage === 1}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">first_page</span>
            </button>
            <button
              onClick={() => setPage(state.currentPage - 1)}
              disabled={state.currentPage === 1}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (state.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (state.currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = state.currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      state.currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage(state.currentPage + 1)}
              disabled={state.currentPage === totalPages}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={state.currentPage === totalPages}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">last_page</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

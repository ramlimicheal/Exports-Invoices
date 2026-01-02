import React from 'react';
import { useApp } from '../context/AppContext';
import { Invoice, InvoiceStatus } from '../types';

const statusColumns: { status: InvoiceStatus; label: string; color: string; bgColor: string }[] = [
  { status: 'Quote', label: 'Quotes', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200' },
  { status: 'Unpaid', label: 'Unpaid', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
  { status: 'In-Transit', label: 'In Transit', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  { status: 'Paid', label: 'Paid', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
];

interface BoardCardProps {
  invoice: Invoice;
  isSelected: boolean;
  onSelect: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ invoice, isSelected, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className={`bg-white dark:bg-gray-800 rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-primary">{invoice.id}</span>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${invoice.companyColor} ${invoice.companyTextColor}`}>
          {invoice.companyInitial}
        </span>
      </div>
      
      {/* Company */}
      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
        {invoice.companyName}
      </h4>
      
      {/* Commodity */}
      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-medium mb-2">
        {invoice.commodityName}
      </span>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500">{invoice.destinationCountry}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          ${invoice.amount.toLocaleString()}
        </span>
      </div>
      
      {/* Date */}
      <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
        <span className="material-symbols-outlined text-[12px]">calendar_today</span>
        {invoice.issueDate}
      </div>
    </div>
  );
};

export const BoardView: React.FC = () => {
  const { filteredInvoices, state, setSelectedInvoice } = useApp();
  
  const getInvoicesByStatus = (status: InvoiceStatus): Invoice[] => {
    return filteredInvoices.filter(inv => inv.status === status);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kanban Board</h3>
        <p className="text-xs text-gray-400">Click a card to view details and update status</p>
      </div>
      
      {/* Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {statusColumns.map(({ status, label, color, bgColor }) => {
            const invoices = getInvoicesByStatus(status);
            const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
            
            return (
              <div 
                key={status}
                className={`w-72 flex-shrink-0 rounded-xl border ${bgColor} flex flex-col h-full`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-gray-200/50">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold text-sm ${color}`}>{label}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${color} bg-white/50`}>
                      {invoices.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Total: ${totalAmount.toLocaleString()}
                  </p>
                </div>
                
                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <span className="material-symbols-outlined text-3xl mb-2">inbox</span>
                      <p className="text-xs">No {label.toLowerCase()}</p>
                    </div>
                  ) : (
                    invoices.map(invoice => (
                      <BoardCard
                        key={invoice.id}
                        invoice={invoice}
                        isSelected={state.selectedInvoiceId === invoice.id}
                        onSelect={() => setSelectedInvoice(invoice.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

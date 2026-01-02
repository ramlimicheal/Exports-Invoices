import React from 'react';
import { Invoice } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
  selectedId: string;
  onSelect: (id: string) => void;
  onNewQuote: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, selectedId, onSelect, onNewQuote }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
      {/* List Header */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Trading Activity</h3>
          <p className="text-xs text-gray-400">Manage quotes and active shipments</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search buyer or commodity" 
              className="w-full sm:w-56 pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button 
            onClick={onNewQuote}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 whitespace-nowrap transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">flash_on</span>
            Quick Quote
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 font-medium w-12"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /></th>
              <th className="p-4 font-medium">Ref ID</th>
              <th className="p-4 font-medium">Buyer / Destination</th>
              <th className="p-4 font-medium">Commodity</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total Value</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {invoices.map((inv) => {
              const isSelected = inv.id === selectedId;
              return (
                <tr 
                  key={inv.id} 
                  className={`border-b border-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-primary-light/50' : 'hover:bg-gray-50'}`}
                  onClick={() => onSelect(inv.id)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} readOnly className="rounded border-gray-300 text-primary focus:ring-primary" />
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
                        <div className="text-gray-900 font-medium">{inv.companyName}</div>
                        <div className="text-xs text-gray-400">{inv.destinationCountry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                      {inv.commodityName}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    <div className="text-gray-900 font-medium">{inv.issueDate}</div>
                    <div className="text-xs text-gray-400">{inv.dueDate}</div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">${inv.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
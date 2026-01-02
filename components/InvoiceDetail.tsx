import React from 'react';
import { InvoiceDetailData } from '../types';

interface InvoiceDetailProps {
  invoice: InvoiceDetailData;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice }) => {
  const isQuote = invoice.status === 'Quote';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col p-6 h-full">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {isQuote ? 'Quote Preview' : 'Commercial Invoice'}
        </h3>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">print</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">send</span>
            Email to Buyer
          </button>
        </div>
      </div>

      {/* Document Header */}
      <div className="mb-6 flex justify-between items-start border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-xl font-bold text-primary mb-1">{invoice.id}</h2>
          <div className="flex gap-2 mt-2">
            <span className="bg-primary-light text-primary text-xs px-2 py-0.5 rounded border border-primary/20 font-medium">
              {invoice.status}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded border border-gray-200 font-medium">
              {invoice.incoterms}
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500">
          <div>Date: <span className="text-gray-900 font-medium">{invoice.issueDate}</span></div>
          <div className="mt-1">{isQuote ? 'Valid Until:' : 'Due Date:'} <span className="text-gray-900 font-medium">{invoice.dueDate}</span></div>
          <div className="mt-2 text-[10px] text-gray-400 uppercase tracking-wider">Export Ref: EXP-{invoice.id.split('-')[1]}</div>
        </div>
      </div>

      {/* Trade Parties */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Exporter / Shipper</p>
          <p className="font-bold text-gray-900 text-sm">{invoice.billFrom.name}</p>
          <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{invoice.billFrom.address}</p>
          <p className="text-xs text-gray-500 mt-2 font-mono">{invoice.billFrom.taxId}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Consignee / Buyer</p>
          <p className="font-bold text-gray-900 text-sm">{invoice.billTo.name}</p>
          <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{invoice.billTo.address}</p>
          <p className="text-xs text-gray-500 mt-1">{invoice.billTo.email}</p>
        </div>
      </div>

      {/* Logistics Details */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs border border-gray-200 rounded-lg p-3">
        <div>
          <span className="text-gray-400 block mb-1">Port of Loading</span>
          <span className="font-medium text-gray-900">{invoice.portOfLoading}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-1">Port of Discharge</span>
          <span className="font-medium text-gray-900">{invoice.portOfDischarge}</span>
        </div>
      </div>

      {/* Items Table */}
      <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Commodity Details</h4>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-medium border-y border-gray-200">
            <tr>
              <th className="p-3">Description / HS Code</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="p-3">
                  <span className="font-medium text-gray-900 block">{item.description}</span>
                  <span className="text-gray-400 text-[10px]">HS: {item.hsCode} | {item.packaging}</span>
                </td>
                <td className="p-3 text-right text-gray-900">${item.price.toFixed(2)}</td>
                <td className="p-3 text-right text-gray-900">{item.qty} {item.unit}</td>
                <td className="p-3 text-right text-gray-900 font-medium">${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financials */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-end gap-12 text-xs mb-2">
          <span className="text-gray-500">Sub Total</span>
          <span className="text-gray-900 font-medium w-24 text-right">${invoice.subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-end gap-12 text-xs mb-2">
          <span className="text-gray-500">Freight & Insurance</span>
          <span className="text-gray-900 font-medium w-24 text-right">${invoice.freightCost.toFixed(2)}</span>
        </div>
        
        {/* Internal view only - distinct background */}
        <div className="flex justify-end gap-12 text-xs mb-2 bg-yellow-50 p-1 -mr-1 rounded">
          <span className="text-yellow-700 font-medium">Internal Commission (5%)</span>
          <span className="text-yellow-700 font-bold w-24 text-right">${invoice.commission.toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-12 text-sm font-bold border-t border-gray-200 pt-4 mt-2">
          <span className="text-gray-900">Total (CIF)</span>
          <span className="text-primary w-24 text-right">${invoice.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Note */}
      <div className="bg-gray-50 p-4 rounded-lg mt-auto border-l-4 border-primary">
        <p className="text-[10px] font-bold text-gray-900 mb-1 uppercase">Terms & Conditions</p>
        <p className="text-xs text-gray-500 leading-relaxed">{invoice.note}</p>
      </div>
    </div>
  );
};
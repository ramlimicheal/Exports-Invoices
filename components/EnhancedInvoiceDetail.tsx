import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Helper function to generate printable invoice HTML
const generateInvoiceHTML = (invoice: any): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #EF4444; }
        .status { padding: 4px 12px; border-radius: 4px; font-size: 12px; }
        .status-paid { background: #DEF7EC; color: #03543F; }
        .status-quote { background: #FEF3C7; color: #92400E; }
        .status-unpaid { background: #FEE2E2; color: #991B1B; }
        .status-transit { background: #DBEAFE; color: #1E40AF; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #E5E7EB; border-radius: 8px; }
        .section-title { font-size: 10px; color: #6B7280; text-transform: uppercase; margin-bottom: 8px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #E5E7EB; }
        th { background: #F9FAFB; font-size: 12px; color: #6B7280; }
        .total-row { font-weight: bold; font-size: 16px; }
        .total-amount { color: #EF4444; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">${invoice.id}</div>
          <span class="status status-${invoice.status.toLowerCase().replace('-', '')}">${invoice.status}</span>
        </div>
        <div style="text-align: right;">
          <div>Date: ${invoice.issueDate}</div>
          <div>Due: ${invoice.dueDate}</div>
        </div>
      </div>
      <div class="grid">
        <div class="section">
          <div class="section-title">Exporter / Shipper</div>
          <strong>${invoice.billFrom.name}</strong>
          <div>${invoice.billFrom.address}</div>
          <div>${invoice.billFrom.taxId}</div>
        </div>
        <div class="section">
          <div class="section-title">Consignee / Buyer</div>
          <strong>${invoice.billTo.name}</strong>
          <div>${invoice.billTo.address}</div>
          <div>${invoice.billTo.email}</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Commodity Details</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item: any) => `
              <tr>
                <td>${item.description}<br><small>HS: ${item.hsCode}</small></td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.qty} ${item.unit}</td>
                <td>$${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="text-align: right; margin-top: 20px;">
        <div>Sub Total: $${invoice.subTotal.toFixed(2)}</div>
        <div>Freight & Insurance: $${invoice.freightCost.toFixed(2)}</div>
        <div class="total-row">Total: <span class="total-amount">$${invoice.total.toFixed(2)}</span></div>
      </div>
    </body>
    </html>
  `;
};

export const EnhancedInvoiceDetail: React.FC = () => {
  const { selectedInvoiceDetail, state, updateInvoice, addComment, addActivity } = useApp();
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details');
  const [emailSending, setEmailSending] = useState(false);
  
  // Handle print invoice
  const handlePrint = () => {
    if (!selectedInvoiceDetail) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateInvoiceHTML(selectedInvoiceDetail));
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  // Handle download invoice as HTML file
  const handleDownload = () => {
    if (!selectedInvoiceDetail) return;
    const html = generateInvoiceHTML(selectedInvoiceDetail);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedInvoiceDetail.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Handle email to buyer
  const handleEmail = async () => {
    if (!selectedInvoiceDetail || !state.currentUser) return;
    setEmailSending(true);
    
    // Simulate email sending (in production, this would call the backend API)
    setTimeout(() => {
      setEmailSending(false);
      alert(`Email sent to ${selectedInvoiceDetail.billTo.email} for invoice ${selectedInvoiceDetail.id}`);
      
      // Add activity
      addActivity({
        id: `act-${Date.now()}`,
        type: 'email_sent',
        invoiceId: selectedInvoiceDetail.id,
        userId: state.currentUser!.id,
        userName: state.currentUser!.name,
        description: `${state.currentUser!.name} sent invoice to ${selectedInvoiceDetail.billTo.email}`,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };
  
  if (!selectedInvoiceDetail) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center p-8 h-full">
        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">receipt_long</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Invoice Selected</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Select an invoice from the list to view its details
        </p>
      </div>
    );
  }
  
  const invoice = selectedInvoiceDetail;
  const isQuote = invoice.status === 'Quote';
  
  // Get comments for this invoice
  const invoiceComments = state.comments.filter(c => c.invoiceId === invoice.id);
  
  // Get activities for this invoice
  const invoiceActivities = state.activities.filter(a => a.invoiceId === invoice.id);
  
  const handleAddComment = () => {
    if (!newComment.trim() || !state.currentUser) return;
    
    const comment = {
      id: `comment-${Date.now()}`,
      invoiceId: invoice.id,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      userAvatar: state.currentUser.avatar,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      mentions: [],
    };
    
    addComment(comment);
    
    // Add activity
    addActivity({
      id: `act-${Date.now()}`,
      type: 'comment',
      invoiceId: invoice.id,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      description: `${state.currentUser.name} commented on invoice ${invoice.id}`,
      timestamp: new Date().toISOString(),
    });
    
    setNewComment('');
  };
  
  const handleStatusChange = (newStatus: string) => {
    updateInvoice(invoice.id, { status: newStatus as any });
    
    if (state.currentUser) {
      addActivity({
        id: `act-${Date.now()}`,
        type: 'status_changed',
        invoiceId: invoice.id,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        description: `${state.currentUser.name} changed status to ${newStatus}`,
        timestamp: new Date().toISOString(),
      });
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header Actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {isQuote ? 'Quote Preview' : 'Commercial Invoice'}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            title="Print Invoice"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
          </button>
          <button 
            onClick={handleDownload}
            title="Download Invoice"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
          <button 
            onClick={handleEmail}
            disabled={emailSending}
            className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-primary rounded hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">{emailSending ? 'hourglass_empty' : 'send'}</span>
            {emailSending ? 'Sending...' : 'Email to Buyer'}
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
            activeTab === 'comments'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Comments
          {invoiceComments.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 rounded-full">
              {invoiceComments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'activity'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Activity
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Document Header */}
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">{invoice.id}</h2>
                <div className="flex gap-2 mt-2">
                  <select
                    value={invoice.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`text-xs px-2 py-0.5 rounded border font-medium cursor-pointer ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                      invoice.status === 'Quote' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      invoice.status === 'In-Transit' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-primary-light text-primary border-red-100'
                    }`}
                  >
                    <option value="Quote">Quote</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="In-Transit">In-Transit</option>
                    <option value="Paid">Paid</option>
                  </select>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 font-medium">
                    {invoice.incoterms}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                <div>Date: <span className="text-gray-900 dark:text-white font-medium">{invoice.issueDate}</span></div>
                <div className="mt-1">{isQuote ? 'Valid Until:' : 'Due Date:'} <span className="text-gray-900 dark:text-white font-medium">{invoice.dueDate}</span></div>
                <div className="mt-2 text-[10px] text-gray-400 uppercase tracking-wider">Export Ref: EXP-{invoice.id.split('-')[1]}</div>
              </div>
            </div>

            {/* Trade Parties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Exporter / Shipper</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{invoice.billFrom.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line">{invoice.billFrom.address}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">{invoice.billFrom.taxId}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Consignee / Buyer</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{invoice.billTo.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line">{invoice.billTo.address}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{invoice.billTo.email}</p>
              </div>
            </div>

            {/* Logistics Details */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-gray-200 dark:border-gray-600 rounded-lg p-3">
              <div>
                <span className="text-gray-400 block mb-1">Port of Loading</span>
                <span className="font-medium text-gray-900 dark:text-white">{invoice.portOfLoading}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Port of Discharge</span>
                <span className="font-medium text-gray-900 dark:text-white">{invoice.portOfDischarge}</span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Commodity Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium border-y border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="p-2">Description / HS Code</th>
                      <th className="p-2 text-right">Unit Price</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <span className="font-medium text-gray-900 dark:text-white block">{item.description}</span>
                          <span className="text-gray-400 text-[10px]">HS: {item.hsCode} | {item.packaging}</span>
                        </td>
                        <td className="p-2 text-right text-gray-900 dark:text-white">${item.price.toFixed(2)}</td>
                        <td className="p-2 text-right text-gray-900 dark:text-white">{item.qty} {item.unit}</td>
                        <td className="p-2 text-right text-gray-900 dark:text-white font-medium">${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financials */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex justify-end gap-12 text-xs mb-2">
                <span className="text-gray-500 dark:text-gray-400">Sub Total</span>
                <span className="text-gray-900 dark:text-white font-medium w-24 text-right">${invoice.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-end gap-12 text-xs mb-2">
                <span className="text-gray-500 dark:text-gray-400">Freight & Insurance</span>
                <span className="text-gray-900 dark:text-white font-medium w-24 text-right">${invoice.freightCost.toFixed(2)}</span>
              </div>
              
              {/* Internal view only */}
              <div className="flex justify-end gap-12 text-xs mb-2 bg-yellow-50 dark:bg-yellow-900/20 p-1 -mr-1 rounded">
                <span className="text-yellow-700 dark:text-yellow-400 font-medium">Internal Commission (5%)</span>
                <span className="text-yellow-700 dark:text-yellow-400 font-bold w-24 text-right">${invoice.commission.toFixed(2)}</span>
              </div>

              <div className="flex justify-end gap-12 text-sm font-bold border-t border-gray-200 dark:border-gray-600 pt-4 mt-2">
                <span className="text-gray-900 dark:text-white">Total (CIF)</span>
                <span className="text-primary w-24 text-right">${invoice.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Note */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-primary">
              <p className="text-[10px] font-bold text-gray-900 dark:text-white mb-1 uppercase">Terms & Conditions</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{invoice.note}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {/* Add Comment */}
            <div className="flex gap-3">
              <img 
                src={state.currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=EF4444&color=fff'}
                alt="User"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
            
            {/* Comments List */}
            <div className="space-y-4">
              {invoiceComments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">chat_bubble</span>
                  <p className="text-sm">No comments yet</p>
                </div>
              ) : (
                invoiceComments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <img 
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.userName}</span>
                        <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="space-y-4">
            {invoiceActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2 block">history</span>
                <p className="text-sm">No activity yet</p>
              </div>
            ) : (
              invoiceActivities.map(activity => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-gray-500 dark:text-gray-400">
                      {activity.type === 'created' ? 'add_circle' :
                       activity.type === 'updated' ? 'edit' :
                       activity.type === 'status_changed' ? 'swap_horiz' :
                       activity.type === 'comment' ? 'chat_bubble' :
                       activity.type === 'payment' ? 'payments' :
                       activity.type === 'shipped' ? 'local_shipping' :
                       'check_circle'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                    <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

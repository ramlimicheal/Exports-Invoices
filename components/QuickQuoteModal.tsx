import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({ isOpen, onClose }) => {
  const { state, addInvoice, addActivity } = useApp();
  const commodities = state.commodities;
  
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(commodities[0]?.id || 'c1');
  const [qty, setQty] = useState<number>(100);
  const [marginPercent, setMarginPercent] = useState<number>(5);
  const [freightCost, setFreightCost] = useState<number>(0);
  const [incoterms, setIncoterms] = useState<string>('CIF');
  const [buyerName, setBuyerName] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Derived state
  const commodity = commodities.find(c => c.id === selectedCommodityId) || commodities[0];
  const basePrice = commodity ? commodity.dailyRate * qty : 0;
  const marginAmount = basePrice * (marginPercent / 100);
  const sellPrice = basePrice + marginAmount;
  const totalQuote = sellPrice + freightCost;
  const unitPriceFinal = qty > 0 ? totalQuote / qty : 0;

  const handleGenerateInvoice = () => {
    if (!commodity) return;
    
    setIsSubmitting(true);
    
    // Generate a new invoice ID
    const invoiceNum = state.invoices.length + 1;
    const invoiceId = `INV-${String(invoiceNum).padStart(4, '0')}`;
    
    // Create the new invoice
    const newInvoice = {
      id: invoiceId,
      companyName: buyerName || 'New Buyer',
      companyInitial: (buyerName || 'N')[0].toUpperCase(),
      companyColor: 'bg-blue-100',
      companyTextColor: 'text-blue-700',
      shippingId: `SHP-${String(invoiceNum).padStart(4, '0')}`,
      commodityName: commodity.name,
      destinationCountry: destination || 'TBD',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: Math.round(totalQuote),
      status: 'Quote' as const,
    };
    
    addInvoice(newInvoice);
    
    // Add activity
    if (state.currentUser) {
      addActivity({
        id: `act-${Date.now()}`,
        type: 'created',
        invoiceId: invoiceId,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        description: `${state.currentUser.name} created quote ${invoiceId}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Reset form
    setQty(100);
    setMarginPercent(5);
    setFreightCost(0);
    setBuyerName('');
    setDestination('');
    setIsSubmitting(false);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bolt</span>
              Quick Quote Generator
            </h2>
            <p className="text-gray-400 text-sm mt-1">Real-time market rates & commission calculator</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Section */}
            <div className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Buyer Name</label>
                <input 
                  type="text" 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Enter buyer company name"
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Destination</label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination country"
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Commodity</label>
                <select 
                  value={selectedCommodityId}
                  onChange={(e) => setSelectedCommodityId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {commodities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Market Rate:</span>
                  <span className="font-bold text-gray-900">${commodity.dailyRate.toFixed(2)} / {commodity.unit}</span>
                  <span className={`flex items-center ${commodity.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">{commodity.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quantity ({commodity.unit})</label>
                <input 
                  type="number" 
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Margin (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Freight Est ($)</label>
                  <input 
                    type="number" 
                    value={freightCost}
                    onChange={(e) => setFreightCost(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Incoterms</label>
                <div className="flex gap-2">
                  {['FOB', 'CIF', 'EXW'].map(term => (
                    <button 
                      key={term} 
                      onClick={() => setIncoterms(term)}
                      className={`px-3 py-1.5 border rounded text-sm transition-colors ${
                        incoterms === term 
                          ? 'bg-primary text-white border-primary' 
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Preview Section */}
            <div className="bg-primary-light/30 rounded-xl p-5 border border-primary/10 flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Quote Breakdown</h3>
              
              <div className="space-y-3 flex-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Base Cost ({qty} {commodity.unit})</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Your Commission ({marginPercent}%)</span>
                  <span>+ ${marginAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Freight & Logistics</span>
                  <span>+ ${freightCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total Quote</span>
                  <span className="font-bold text-primary text-xl">${totalQuote.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Unit Price to Buyer</span>
                  <span>${unitPriceFinal.toFixed(2)} / {commodity.unit}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                <p className="text-xs text-gray-500 mb-4">
                  * Rates are based on today's market close. Commission is internal.
                </p>
                <button 
                  onClick={handleGenerateInvoice}
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-lg shadow-primary/30 hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">{isSubmitting ? 'hourglass_empty' : 'description'}</span>
                  {isSubmitting ? 'Generating...' : 'Generate Proforma Invoice'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const AnalyticsDashboard: React.FC = () => {
  const { state, filteredInvoices } = useApp();
  
  // Calculate analytics data
  const analytics = useMemo(() => {
    const invoices = state.invoices;
    
    // Revenue by status
    const revenueByStatus = {
      Quote: invoices.filter(i => i.status === 'Quote').reduce((sum, i) => sum + i.amount, 0),
      Unpaid: invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + i.amount, 0),
      'In-Transit': invoices.filter(i => i.status === 'In-Transit').reduce((sum, i) => sum + i.amount, 0),
      Paid: invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0),
    };
    
    // Revenue by destination
    const revenueByDestination: Record<string, number> = {};
    invoices.forEach(inv => {
      revenueByDestination[inv.destinationCountry] = (revenueByDestination[inv.destinationCountry] || 0) + inv.amount;
    });
    
    // Top destinations
    const topDestinations = Object.entries(revenueByDestination)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Revenue by commodity
    const revenueByCommodity: Record<string, number> = {};
    invoices.forEach(inv => {
      revenueByCommodity[inv.commodityName] = (revenueByCommodity[inv.commodityName] || 0) + inv.amount;
    });
    
    // Top commodities
    const topCommodities = Object.entries(revenueByCommodity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Monthly trend (simulated)
    const monthlyTrend = [
      { month: 'Jul', revenue: 125000, invoices: 18 },
      { month: 'Aug', revenue: 142000, invoices: 22 },
      { month: 'Sep', revenue: 138000, invoices: 20 },
      { month: 'Oct', revenue: 165000, invoices: 28 },
      { month: 'Nov', revenue: 178000, invoices: 32 },
      { month: 'Dec', revenue: 195000, invoices: 35 },
    ];
    
    // Total revenue
    const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
    const paidRevenue = revenueByStatus.Paid;
    const pendingRevenue = revenueByStatus.Unpaid + revenueByStatus['In-Transit'];
    
    // Conversion rate (quotes to invoices)
    const quotes = invoices.filter(i => i.status === 'Quote').length;
    const converted = invoices.filter(i => i.status !== 'Quote').length;
    const conversionRate = converted / (quotes + converted) * 100;
    
    return {
      revenueByStatus,
      topDestinations,
      topCommodities,
      monthlyTrend,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      conversionRate,
      totalInvoices: invoices.length,
      avgInvoiceValue: totalRevenue / invoices.length,
    };
  }, [state.invoices]);
  
  const maxMonthlyRevenue = Math.max(...analytics.monthlyTrend.map(m => m.revenue));
  
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Revenue</span>
            <span className="material-symbols-outlined text-green-500">trending_up</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid Revenue</span>
            <span className="material-symbols-outlined text-emerald-500">payments</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.paidRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{((analytics.paidRevenue / analytics.totalRevenue) * 100).toFixed(1)}% of total</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Invoice Value</span>
            <span className="material-symbols-outlined text-blue-500">receipt_long</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.avgInvoiceValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-gray-500 mt-1">From {analytics.totalInvoices} invoices</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion Rate</span>
            <span className="material-symbols-outlined text-purple-500">conversion_path</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">Quotes to invoices</p>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <div className="h-48 flex items-end gap-2">
            {analytics.monthlyTrend.map((month, idx) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative overflow-hidden" style={{ height: '160px' }}>
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/70 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(month.revenue / maxMonthlyRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{month.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Revenue by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Revenue by Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics.revenueByStatus).map(([status, amount]) => {
              const amountNum = amount as number;
              const percentage = (amountNum / analytics.totalRevenue) * 100;
              const colors: Record<string, string> = {
                Quote: 'bg-yellow-400',
                Unpaid: 'bg-red-400',
                'In-Transit': 'bg-blue-400',
                Paid: 'bg-green-400',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{status}</span>
                    <span className="font-medium text-gray-900 dark:text-white">${amountNum.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors[status]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Top Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Top Destinations</h3>
          <div className="space-y-3">
            {analytics.topDestinations.map(([country, amount], idx) => (
              <div key={country} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{country}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">${amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(amount / analytics.topDestinations[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Commodities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Top Commodities</h3>
          <div className="space-y-3">
            {analytics.topCommodities.map(([commodity, amount], idx) => (
              <div key={commodity} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{commodity}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">${amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(amount / analytics.topCommodities[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

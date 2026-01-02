import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Quote': return 'bg-yellow-400';
    case 'Unpaid': return 'bg-red-400';
    case 'In-Transit': return 'bg-blue-400';
    case 'Paid': return 'bg-green-400';
    default: return 'bg-gray-400';
  }
};

export const CalendarView: React.FC = () => {
  const { filteredInvoices, state, setSelectedInvoice } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Parse invoice dates and group by day
  const invoicesByDate = useMemo(() => {
    const map: Record<string, Invoice[]> = {};
    
    filteredInvoices.forEach(invoice => {
      // Parse the date string (e.g., "Oct 24, 2025")
      const dateStr = invoice.issueDate;
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        const key = `${parsed.getFullYear()}-${parsed.getMonth()}-${parsed.getDate()}`;
        if (!map[key]) map[key] = [];
        map[key].push(invoice);
      }
    });
    
    return map;
  }, [filteredInvoices]);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [startingDayOfWeek, daysInMonth]);
  
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {MONTHS[month]} {year}
          </h3>
          <p className="text-xs text-gray-400">Invoice timeline view</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button 
              onClick={goToPreviousMonth}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[100px]" />;
            }
            
            const dateKey = `${year}-${month}-${day}`;
            const dayInvoices = invoicesByDate[dateKey] || [];
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={day}
                className={`min-h-[100px] border rounded-lg p-1 ${
                  isCurrentDay 
                    ? 'border-primary bg-primary-light/30' 
                    : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                } transition-colors`}
              >
                <div className={`text-xs font-medium mb-1 ${
                  isCurrentDay ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {day}
                </div>
                
                <div className="space-y-1">
                  {dayInvoices.slice(0, 3).map(invoice => (
                    <button
                      key={invoice.id}
                      onClick={() => setSelectedInvoice(invoice.id)}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] truncate ${
                        state.selectedInvoiceId === invoice.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } transition-colors`}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${getStatusColor(invoice.status)}`} />
                      {invoice.id}
                    </button>
                  ))}
                  {dayInvoices.length > 3 && (
                    <div className="text-[10px] text-gray-400 px-1">
                      +{dayInvoices.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-4 flex-shrink-0">
        {['Quote', 'Unpaid', 'In-Transit', 'Paid'].map(status => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};

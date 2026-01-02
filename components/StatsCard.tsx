import React from 'react';

interface StatsCardProps {
  icon: string;
  title: string;
  amount: string;
  count: number;
  color?: string;
  isGreenCount?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  icon, 
  title, 
  amount, 
  count,
  color = "text-primary",
  isGreenCount = true
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900">{amount}</h2>
        <p className="text-xs text-gray-400">
          from <span className={`${isGreenCount ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} px-1 rounded font-medium`}>{count}</span> Invoices
        </p>
      </div>
    </div>
  );
};
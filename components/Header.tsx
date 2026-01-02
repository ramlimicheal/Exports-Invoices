import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices & Billing</h1>
          <p className="text-sm text-gray-500">Dashboard / Invoices & Billing</p>
        </div>
      </div>
      
      <div className="relative w-full md:w-80">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input 
          type="text" 
          placeholder="Search anything" 
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
        />
      </div>
    </header>
  );
};
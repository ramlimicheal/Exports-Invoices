import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'settings' | 'search';
}

export const CommandPalette: React.FC = () => {
  const { 
    state, 
    toggleCommandPalette, 
    setViewMode, 
    toggleQuoteModal, 
    toggleTheme,
    toggleSettings,
    setFilters,
    setActiveNav,
    filteredInvoices,
    setSelectedInvoice,
  } = useApp();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const commands: Command[] = useMemo(() => [
    // Navigation
    { id: 'nav-dashboard', label: 'Go to Dashboard', icon: 'dashboard', category: 'navigation', action: () => { setActiveNav('Dashboard'); toggleCommandPalette(); } },
    { id: 'nav-analytics', label: 'Go to Analytics', icon: 'analytics', category: 'navigation', action: () => { setActiveNav('Analytics'); toggleCommandPalette(); } },
    { id: 'nav-invoices', label: 'Go to Invoices', icon: 'receipt_long', category: 'navigation', action: () => { setActiveNav('Invoices & Billing'); toggleCommandPalette(); } },
    { id: 'nav-shipments', label: 'Go to Shipments', icon: 'local_shipping', category: 'navigation', action: () => { setActiveNav('Shipments'); toggleCommandPalette(); } },
    
    // Actions
    { id: 'action-new-quote', label: 'Create New Quote', description: 'Generate a quick quote', icon: 'flash_on', shortcut: 'N', category: 'actions', action: () => { toggleQuoteModal(); toggleCommandPalette(); } },
    { id: 'action-export', label: 'Export Invoices', description: 'Download as CSV', icon: 'download', category: 'actions', action: () => { alert('Exporting invoices...'); toggleCommandPalette(); } },
    { id: 'action-refresh', label: 'Refresh Data', icon: 'refresh', category: 'actions', action: () => { window.location.reload(); } },
    
    // Views
    { id: 'view-list', label: 'Switch to List View', icon: 'view_list', shortcut: '1', category: 'actions', action: () => { setViewMode('list'); toggleCommandPalette(); } },
    { id: 'view-board', label: 'Switch to Board View', icon: 'view_kanban', shortcut: '2', category: 'actions', action: () => { setViewMode('board'); toggleCommandPalette(); } },
    { id: 'view-calendar', label: 'Switch to Calendar View', icon: 'calendar_month', shortcut: '3', category: 'actions', action: () => { setViewMode('calendar'); toggleCommandPalette(); } },
    
    // Filters
    { id: 'filter-quotes', label: 'Show Only Quotes', icon: 'filter_list', category: 'actions', action: () => { setFilters({ status: 'Quote' }); toggleCommandPalette(); } },
    { id: 'filter-unpaid', label: 'Show Unpaid Invoices', icon: 'filter_list', category: 'actions', action: () => { setFilters({ status: 'Unpaid' }); toggleCommandPalette(); } },
    { id: 'filter-transit', label: 'Show In-Transit', icon: 'filter_list', category: 'actions', action: () => { setFilters({ status: 'In-Transit' }); toggleCommandPalette(); } },
    { id: 'filter-clear', label: 'Clear All Filters', icon: 'filter_list_off', category: 'actions', action: () => { setFilters({ status: 'All', search: '', commodity: 'All', destination: 'All' }); toggleCommandPalette(); } },
    
    // Settings
    { id: 'settings-theme', label: 'Toggle Dark Mode', icon: 'dark_mode', category: 'settings', action: () => { toggleTheme(); toggleCommandPalette(); } },
    { id: 'settings-open', label: 'Open Settings', icon: 'settings', category: 'settings', action: () => { toggleSettings(); toggleCommandPalette(); } },
  ], [setActiveNav, toggleCommandPalette, toggleQuoteModal, setViewMode, setFilters, toggleTheme, toggleSettings]);
  
  // Add invoice search results
  const invoiceResults = useMemo(() => {
    if (query.length < 2) return [];
    const searchLower = query.toLowerCase();
    return filteredInvoices
      .filter(inv => 
        inv.id.toLowerCase().includes(searchLower) ||
        inv.companyName.toLowerCase().includes(searchLower) ||
        inv.commodityName.toLowerCase().includes(searchLower)
      )
      .slice(0, 5)
      .map(inv => ({
        id: `invoice-${inv.id}`,
        label: inv.id,
        description: `${inv.companyName} - ${inv.commodityName}`,
        icon: inv.status === 'Quote' ? 'description' : 'receipt_long',
        category: 'search' as const,
        action: () => { setSelectedInvoice(inv.id); toggleCommandPalette(); },
      }));
  }, [query, filteredInvoices, setSelectedInvoice, toggleCommandPalette]);
  
  const filteredCommands = useMemo(() => {
    const allCommands = [...invoiceResults, ...commands];
    if (!query) return commands;
    
    const searchLower = query.toLowerCase();
    return allCommands.filter(cmd => 
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower)
    );
  }, [query, commands, invoiceResults]);
  
  // Focus input on open
  useEffect(() => {
    if (state.isCommandPaletteOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [state.isCommandPaletteOpen]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isCommandPaletteOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isCommandPaletteOpen, filteredCommands, selectedIndex]);
  
  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement;
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);
  
  if (!state.isCommandPaletteOpen) return null;
  
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);
  
  const categoryLabels: Record<string, string> = {
    search: 'Search Results',
    navigation: 'Navigation',
    actions: 'Actions',
    settings: 'Settings',
  };
  
  let globalIndex = -1;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={toggleCommandPalette}
      />
      
      {/* Palette */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search commands, invoices, or type a query..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
            ESC
          </kbd>
        </div>
        
        {/* Results */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-2">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {categoryLabels[category] || category}
                </div>
                {(cmds as Command[]).map((cmd) => {
                  globalIndex++;
                  const isSelected = globalIndex === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isSelected 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                        {cmd.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{cmd.label}</div>
                        {cmd.description && (
                          <div className={`text-xs truncate ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                            {cmd.description}
                          </div>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <kbd className={`px-1.5 py-0.5 text-[10px] rounded ${
                          isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}>
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">⌘</kbd>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">K</kbd>
            to toggle
          </span>
        </div>
      </div>
    </div>
  );
};

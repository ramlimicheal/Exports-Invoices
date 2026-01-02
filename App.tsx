import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { EnhancedSidebar } from './components/EnhancedSidebar';
import { EnhancedHeader } from './components/EnhancedHeader';
import { EnhancedStatsCards } from './components/EnhancedStatsCard';
import { EnhancedInvoiceList } from './components/EnhancedInvoiceList';
import { EnhancedInvoiceDetail } from './components/EnhancedInvoiceDetail';
import { BoardView } from './components/BoardView';
import { CalendarView } from './components/CalendarView';
import { FilterPanel } from './components/FilterPanel';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { ActivityFeed } from './components/ActivityFeed';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { QuickQuoteModal } from './components/QuickQuoteModal';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';

const MainContent: React.FC = () => {
  const { state, toggleQuoteModal } = useApp();
  
  // Render different content based on active nav item
  const renderContent = () => {
    switch (state.activeNavItem) {
      case 'Analytics':
        return (
          <div className="flex-1">
            <AnalyticsDashboard />
          </div>
        );
      
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <EnhancedStatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIInsightsPanel />
              <ActivityFeed />
            </div>
          </div>
        );
      
      case 'Invoices & Billing':
      default:
        return (
          <>
            {/* Stats Overview */}
            <EnhancedStatsCards />
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
              {/* Left Panel */}
              <div className="xl:col-span-2 h-full min-h-[500px] flex flex-col gap-4">
                {/* Filter Panel */}
                <FilterPanel />
                
                {/* Main View */}
                <div className="flex-1 min-h-0">
                  {state.viewMode === 'list' && <EnhancedInvoiceList />}
                  {state.viewMode === 'board' && <BoardView />}
                  {state.viewMode === 'calendar' && <CalendarView />}
                </div>
              </div>

              {/* Right Panel: Invoice Details + AI Insights */}
              <div className="xl:col-span-1 h-full min-h-[500px] flex flex-col gap-4">
                <div className="flex-1 min-h-0">
                  <EnhancedInvoiceDetail />
                </div>
                <div className="hidden xl:block">
                  <AIInsightsPanel />
                </div>
              </div>
            </div>
          </>
        );
    }
  };
  
  return (
    <div className={`h-screen w-full flex overflow-hidden ${state.settings.theme === 'dark' ? 'dark bg-gray-900' : 'bg-background-light'}`}>
      {/* Sidebar Navigation */}
      <EnhancedSidebar />

      {/* Quote Modal */}
      <QuickQuoteModal isOpen={state.isQuoteModalOpen} onClose={toggleQuoteModal} />
      
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Settings Modal */}
      <SettingsModal />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
        <div className="p-4 lg:p-8 max-w-[1600px] w-full mx-auto flex-1 flex flex-col">
          <EnhancedHeader />
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceDetail } from './components/InvoiceDetail';
import { QuickQuoteModal } from './components/QuickQuoteModal';
import { INVOICES, SELECTED_INVOICE_DETAIL } from './constants';

const App: React.FC = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(INVOICES[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-background-light flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Quote Modal */}
      <QuickQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
        <div className="p-4 lg:p-8 max-w-[1600px] w-full mx-auto flex-1 flex flex-col">
          
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8 flex-none">
            <StatsCard 
              icon="verified" 
              title="Active Quotes" 
              amount="$18,500" 
              count={5} 
            />
            <StatsCard 
              icon="directions_boat" 
              title="In-Transit Value" 
              amount="$94,200" 
              count={8} 
              color="text-blue-600"
            />
            <StatsCard 
              icon="savings" 
              title="Commissions (MTD)" 
              amount="$4,150" 
              count={12} 
              color="text-green-600"
            />
            <StatsCard 
              icon="schedule" 
              title="Pending Actions" 
              amount="3" 
              count={3} 
              color="text-orange-600"
              isGreenCount={false}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Left Panel: Invoice List */}
            <div className="xl:col-span-2 h-full min-h-[500px]">
              <InvoiceList 
                invoices={INVOICES} 
                selectedId={selectedInvoiceId}
                onSelect={setSelectedInvoiceId}
                onNewQuote={() => setIsQuoteModalOpen(true)}
              />
            </div>

            {/* Right Panel: Invoice Details */}
            <div className="xl:col-span-1 h-full min-h-[500px]">
              <InvoiceDetail invoice={SELECTED_INVOICE_DETAIL} />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default App;
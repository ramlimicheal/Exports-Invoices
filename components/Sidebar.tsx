import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: string; label: string; active?: boolean; badge?: string; badgeColor?: string }> = ({ 
  icon, 
  label, 
  active, 
  badge,
  badgeColor = "bg-primary"
}) => {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        active 
          ? 'text-primary bg-primary-light' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className={`${badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>
          {badge}
        </span>
      )}
    </a>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex-shrink-0
        w-64 bg-sidebar-light border-r border-gray-200 
        flex flex-col h-full transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-6 py-6 flex items-center gap-2 flex-none">
          <div className="text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">bolt</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SHIPNOW</span>
        </div>

        {/* User Profile */}
        <div className="px-4 mb-6 flex-none">
          <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors">
            <div className="flex items-center gap-3">
              <img 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full border border-gray-300" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkS7xkdmrK-_Z6BMsQNWUxLkdqOz8lyJsLtXrMsSotvKGR2QxfIIT5P72BvCeUe7VcAbmufnRTKArht8r9EzSI-fBBcWYZpXXGrSMqRAwL-1hmlgpLcSKC3tq6pNeyMDmTbLowJP2CB0PsqeiMnpYXsJsOLsrxOJb2sNTjVUYOe5Bi5A988FGMZja1CVG73EaokuI-rB5dnnYll4Y7eION_i5Ws67Nngr8vPBv66oBZaT-l1AUz1vRPJsWfIBWg05aEHHnkjNblS7f" 
              />
              <div>
                <div className="text-sm font-semibold text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon="dashboard" label="Dashboard" />
          <NavItem icon="analytics" label="Analytics" />
          <NavItem icon="calendar_month" label="Calendar" />
          <NavItem icon="local_shipping" label="Shipments" />
          <NavItem icon="share_location" label="Tracking" />
          <NavItem icon="warehouse" label="Warehouse" />
          <NavItem icon="directions_bus" label="Fleets" />
          <NavItem icon="badge" label="Drivers" />
          <NavItem icon="receipt_long" label="Invoices & Billing" active />
          
          <div className="pt-4 pb-2">
            <div className="h-px bg-gray-200 mx-3"></div>
          </div>

          <NavItem icon="chat_bubble" label="Message" badge="19" />
          <NavItem icon="notifications" label="Notification" badge="5" />
          <NavItem icon="settings" label="Settings" />
        </nav>

        {/* Footer / Pro Card */}
        <div className="p-4 mt-auto flex-none">
          <div className="bg-gray-900 rounded-xl p-5 relative overflow-hidden text-white mb-4">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-primary rounded-full opacity-20 blur-xl"></div>
            <h3 className="text-lg font-bold mb-2">Loving<br/>ShipNow<br/>Free?</h3>
            <p className="text-xs text-gray-400 mb-4">Go Pro to access priority support, real-time tracking, and full analytics.</p>
            <button className="w-full bg-white text-gray-900 text-sm font-semibold py-2 rounded-lg hover:bg-gray-100 transition">Go Pro Today</button>
          </div>
          
          <div className="text-xs text-gray-400 text-center">
            Copyright © 2025 Peterdraw<br/>
            <span className="space-x-2 mt-1 block">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Contact</a>
            </span>
          </div>

          <div className="flex justify-center gap-3 mt-4 text-gray-400 pb-2">
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-gray-600">public</span>
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-gray-600">close</span>
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-gray-600">camera_alt</span>
          </div>
        </div>
      </aside>
    </>
  );
};
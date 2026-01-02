import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  active, 
  badge,
  badgeColor = "bg-primary",
  onClick,
}) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        active 
          ? 'text-primary bg-primary-light dark:bg-primary/20' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className={`${badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export const EnhancedSidebar: React.FC = () => {
  const { 
    state, 
    toggleSidebar, 
    setActiveNav,
    toggleSettings,
    unreadNotificationCount,
  } = useApp();
  const { logout, user } = useAuth();
  
  const handleNavClick = (item: string) => {
    setActiveNav(item);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {state.isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex-shrink-0
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col h-full transform transition-transform duration-200 ease-in-out
        ${state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-6 py-6 flex items-center gap-2 flex-none">
          <div className="text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">bolt</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">SHIPNOW</span>
        </div>

        {/* User Profile */}
        <div className="px-4 mb-6 flex-none">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <img 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600" 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=EF4444&color=fff`}
              />
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'Admin'}
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem 
            icon="dashboard" 
            label="Dashboard" 
            active={state.activeNavItem === 'Dashboard'}
            onClick={() => handleNavClick('Dashboard')}
          />
          <NavItem 
            icon="analytics" 
            label="Analytics" 
            active={state.activeNavItem === 'Analytics'}
            onClick={() => handleNavClick('Analytics')}
          />
          <NavItem 
            icon="calendar_month" 
            label="Calendar" 
            active={state.activeNavItem === 'Calendar'}
            onClick={() => handleNavClick('Calendar')}
          />
          <NavItem 
            icon="local_shipping" 
            label="Shipments" 
            active={state.activeNavItem === 'Shipments'}
            onClick={() => handleNavClick('Shipments')}
          />
          <NavItem 
            icon="share_location" 
            label="Tracking" 
            active={state.activeNavItem === 'Tracking'}
            onClick={() => handleNavClick('Tracking')}
          />
          <NavItem 
            icon="warehouse" 
            label="Warehouse" 
            active={state.activeNavItem === 'Warehouse'}
            onClick={() => handleNavClick('Warehouse')}
          />
          <NavItem 
            icon="directions_bus" 
            label="Fleets" 
            active={state.activeNavItem === 'Fleets'}
            onClick={() => handleNavClick('Fleets')}
          />
          <NavItem 
            icon="badge" 
            label="Drivers" 
            active={state.activeNavItem === 'Drivers'}
            onClick={() => handleNavClick('Drivers')}
          />
          <NavItem 
            icon="receipt_long" 
            label="Invoices & Billing" 
            active={state.activeNavItem === 'Invoices & Billing'}
            onClick={() => handleNavClick('Invoices & Billing')}
          />
          
          <div className="pt-4 pb-2">
            <div className="h-px bg-gray-200 dark:bg-gray-700 mx-3"></div>
          </div>

          <NavItem 
            icon="chat_bubble" 
            label="Message" 
            badge="19"
            active={state.activeNavItem === 'Message'}
            onClick={() => handleNavClick('Message')}
          />
          <NavItem 
            icon="notifications" 
            label="Notification" 
            badge={unreadNotificationCount > 0 ? String(unreadNotificationCount) : undefined}
            active={state.activeNavItem === 'Notification'}
            onClick={() => handleNavClick('Notification')}
          />
          <NavItem 
            icon="settings" 
            label="Settings"
            active={state.activeNavItem === 'Settings'}
            onClick={() => {
              toggleSettings();
              if (window.innerWidth < 1024) {
                toggleSidebar();
              }
            }}
          />
        </nav>

        {/* Footer / Pro Card */}
        <div className="p-4 mt-auto flex-none">
          <div className="bg-gray-900 dark:bg-gray-700 rounded-xl p-5 relative overflow-hidden text-white mb-4">
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
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">public</span>
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">close</span>
            <span className="material-symbols-outlined text-sm cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">camera_alt</span>
          </div>
        </div>
      </aside>
    </>
  );
};

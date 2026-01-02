import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { 
  AppState, 
  AppAction, 
  appReducer, 
  loadState, 
  saveState,
  getFilteredInvoices,
  getPaginatedInvoices,
  getTotalPages,
  getStats,
  getUnreadNotificationCount,
  getUniqueDestinations,
  getUniqueCommodities,
  ViewMode,
  SortField,
  SortDirection,
  FilterState,
  AppSettings,
  Comment,
  Activity,
} from '../store';
import { Invoice, InvoiceDetailData } from '../types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Computed values
  filteredInvoices: Invoice[];
  paginatedInvoices: Invoice[];
  totalPages: number;
  stats: ReturnType<typeof getStats>;
  unreadNotificationCount: number;
  uniqueDestinations: string[];
  uniqueCommodities: string[];
  selectedInvoiceDetail: InvoiceDetailData | null;
  
  // Actions
  setSelectedInvoice: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSort: (field: SortField, direction: SortDirection) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  deleteSelectedInvoices: () => void;
  addComment: (comment: Comment) => void;
  addActivity: (activity: Activity) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissInsight: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  toggleCommandPalette: () => void;
  toggleQuoteModal: () => void;
  toggleSettings: () => void;
  toggleNotifications: () => void;
  toggleSidebar: () => void;
  setActiveNav: (item: string) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);
  
  // Persist state to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);
  
  // Apply theme to document
  useEffect(() => {
    if (state.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.theme]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        if (state.isCommandPaletteOpen) {
          dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
        } else if (state.isQuoteModalOpen) {
          dispatch({ type: 'TOGGLE_QUOTE_MODAL' });
        } else if (state.isSettingsOpen) {
          dispatch({ type: 'TOGGLE_SETTINGS' });
        } else if (state.isNotificationsOpen) {
          dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
        }
      }
      
      // Keyboard shortcuts when no modal is open
      if (!state.isCommandPaletteOpen && !state.isQuoteModalOpen && !state.isSettingsOpen) {
        // N for new quote
        if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) {
          e.preventDefault();
          dispatch({ type: 'TOGGLE_QUOTE_MODAL' });
        }
        
        // 1, 2, 3 for view modes
        if (e.key === '1' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) {
          dispatch({ type: 'SET_VIEW_MODE', payload: 'list' });
        }
        if (e.key === '2' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) {
          dispatch({ type: 'SET_VIEW_MODE', payload: 'board' });
        }
        if (e.key === '3' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) {
          dispatch({ type: 'SET_VIEW_MODE', payload: 'calendar' });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isCommandPaletteOpen, state.isQuoteModalOpen, state.isSettingsOpen, state.isNotificationsOpen]);
  
  // Computed values
  const filteredInvoices = getFilteredInvoices(state);
  const paginatedInvoices = getPaginatedInvoices(state);
  const totalPages = getTotalPages(state);
  const stats = getStats(state);
  const unreadNotificationCount = getUnreadNotificationCount(state);
  const uniqueDestinations = getUniqueDestinations(state);
  const uniqueCommodities = getUniqueCommodities(state);
  const selectedInvoiceDetail = state.selectedInvoiceId 
    ? state.invoiceDetails[state.selectedInvoiceId] || null 
    : null;
  
  // Actions
  const setSelectedInvoice = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_INVOICE', payload: id });
  }, []);
  
  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);
  
  const setFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);
  
  const setSort = useCallback((field: SortField, direction: SortDirection) => {
    dispatch({ type: 'SET_SORT', payload: { field, direction } });
  }, []);
  
  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);
  
  const setPageSize = useCallback((size: number) => {
    dispatch({ type: 'SET_PAGE_SIZE', payload: size });
  }, []);
  
  const toggleSelect = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SELECT', payload: id });
  }, []);
  
  const selectAll = useCallback(() => {
    dispatch({ type: 'SELECT_ALL', payload: filteredInvoices.map(i => i.id) });
  }, [filteredInvoices]);
  
  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);
  
  const addInvoice = useCallback((invoice: Invoice) => {
    dispatch({ type: 'ADD_INVOICE', payload: invoice });
  }, []);
  
  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    dispatch({ type: 'UPDATE_INVOICE', payload: { id, updates } });
  }, []);
  
  const deleteInvoice = useCallback((id: string) => {
    dispatch({ type: 'DELETE_INVOICE', payload: id });
  }, []);
  
  const deleteSelectedInvoices = useCallback(() => {
    dispatch({ type: 'DELETE_INVOICES', payload: state.selectedIds });
  }, [state.selectedIds]);
  
  const addComment = useCallback((comment: Comment) => {
    dispatch({ type: 'ADD_COMMENT', payload: comment });
  }, []);
  
  const addActivity = useCallback((activity: Activity) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  }, []);
  
  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);
  
  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  }, []);
  
  const dismissInsight = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_INSIGHT', payload: id });
  }, []);
  
  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);
  
  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);
  
  const toggleCommandPalette = useCallback(() => {
    dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
  }, []);
  
  const toggleQuoteModal = useCallback(() => {
    dispatch({ type: 'TOGGLE_QUOTE_MODAL' });
  }, []);
  
  const toggleSettings = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  }, []);
  
  const toggleNotifications = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
  }, []);
  
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);
  
  const setActiveNav = useCallback((item: string) => {
    dispatch({ type: 'SET_ACTIVE_NAV', payload: item });
  }, []);
  
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);
  
  const value: AppContextType = {
    state,
    dispatch,
    filteredInvoices,
    paginatedInvoices,
    totalPages,
    stats,
    unreadNotificationCount,
    uniqueDestinations,
    uniqueCommodities,
    selectedInvoiceDetail,
    setSelectedInvoice,
    setViewMode,
    setFilters,
    setSort,
    setPage,
    setPageSize,
    toggleSelect,
    selectAll,
    clearSelection,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    deleteSelectedInvoices,
    addComment,
    addActivity,
    markNotificationRead,
    markAllNotificationsRead,
    dismissInsight,
    updateSettings,
    toggleTheme,
    toggleCommandPalette,
    toggleQuoteModal,
    toggleSettings,
    toggleNotifications,
    toggleSidebar,
    setActiveNav,
    resetState,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

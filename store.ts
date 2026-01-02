import { Invoice, InvoiceDetailData, Commodity, InvoiceStatus } from './types';

// Extended types for the enhanced application
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Manager' | 'Agent';
}

export interface Comment {
  id: string;
  invoiceId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  mentions: string[];
}

export interface Activity {
  id: string;
  type: 'created' | 'updated' | 'status_changed' | 'comment' | 'payment' | 'shipped' | 'delivered';
  invoiceId: string;
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'prediction' | 'trend';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  action?: string;
  createdAt: string;
}

export interface FilterState {
  search: string;
  status: InvoiceStatus | 'All';
  dateRange: { start: string; end: string } | null;
  amountRange: { min: number; max: number } | null;
  commodity: string | 'All';
  destination: string | 'All';
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailAlerts: boolean;
  currency: string;
  dateFormat: string;
  compactView: boolean;
}

export type ViewMode = 'list' | 'board' | 'calendar';
export type SortField = 'id' | 'companyName' | 'issueDate' | 'dueDate' | 'amount' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface AppState {
  // User & Auth
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  
  // Core Data
  invoices: Invoice[];
  invoiceDetails: Record<string, InvoiceDetailData>;
  commodities: Commodity[];
  
  // UI State
  selectedInvoiceId: string | null;
  viewMode: ViewMode;
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  currentPage: number;
  pageSize: number;
  selectedIds: string[];
  
  // Collaboration
  comments: Comment[];
  activities: Activity[];
  notifications: Notification[];
  
  // AI & Insights
  insights: AIInsight[];
  
  // Settings
  settings: AppSettings;
  
  // Command Palette
  isCommandPaletteOpen: boolean;
  
  // Modals
  isQuoteModalOpen: boolean;
  isSettingsOpen: boolean;
  isNotificationsOpen: boolean;
  
  // Sidebar
  isSidebarOpen: boolean;
  activeNavItem: string;
}

const STORAGE_KEY = 'shipnow_app_state';

// Generate realistic mock data
const generateMockData = () => {
  const companies = [
    { name: 'Global Spice Traders LLC', initial: 'G', color: 'bg-green-100', textColor: 'text-green-700', country: 'UAE', email: 'procurement@globalspices.ae' },
    { name: 'EuroFoods Import GmbH', initial: 'E', color: 'bg-blue-100', textColor: 'text-blue-700', country: 'Germany', email: 'orders@eurofoods.de' },
    { name: 'Oman Trading Co.', initial: 'O', color: 'bg-orange-100', textColor: 'text-orange-700', country: 'Oman', email: 'imports@omantrade.om' },
    { name: 'US Organic Spices', initial: 'U', color: 'bg-purple-100', textColor: 'text-purple-700', country: 'USA', email: 'buying@usorganicspices.com' },
    { name: 'Textile Hub Vietnam', initial: 'T', color: 'bg-indigo-100', textColor: 'text-indigo-700', country: 'Vietnam', email: 'sourcing@textilehub.vn' },
    { name: 'Singapore Commodities Pte', initial: 'S', color: 'bg-teal-100', textColor: 'text-teal-700', country: 'Singapore', email: 'trade@sgcommodities.sg' },
    { name: 'Dubai Spice Souk Trading', initial: 'D', color: 'bg-amber-100', textColor: 'text-amber-700', country: 'UAE', email: 'orders@dubaispice.ae' },
    { name: 'London Tea & Spice Co', initial: 'L', color: 'bg-rose-100', textColor: 'text-rose-700', country: 'UK', email: 'procurement@londonteaspice.co.uk' },
    { name: 'Tokyo Food Imports KK', initial: 'T', color: 'bg-cyan-100', textColor: 'text-cyan-700', country: 'Japan', email: 'imports@tokyofood.jp' },
    { name: 'Australian Gourmet Foods', initial: 'A', color: 'bg-lime-100', textColor: 'text-lime-700', country: 'Australia', email: 'orders@ausgourmet.com.au' },
    { name: 'Canadian Spice Importers', initial: 'C', color: 'bg-red-100', textColor: 'text-red-700', country: 'Canada', email: 'buying@canspice.ca' },
    { name: 'French Gourmet Traders', initial: 'F', color: 'bg-violet-100', textColor: 'text-violet-700', country: 'France', email: 'achats@frenchgourmet.fr' },
    { name: 'Italian Specialty Foods', initial: 'I', color: 'bg-emerald-100', textColor: 'text-emerald-700', country: 'Italy', email: 'ordini@italianspecialty.it' },
    { name: 'Saudi Arabian Trading Est', initial: 'S', color: 'bg-yellow-100', textColor: 'text-yellow-700', country: 'Saudi Arabia', email: 'imports@saudiarabian.sa' },
    { name: 'Malaysian Spice Corp', initial: 'M', color: 'bg-pink-100', textColor: 'text-pink-700', country: 'Malaysia', email: 'orders@myspice.my' },
  ];

  const commodities: Commodity[] = [
    { id: 'c1', name: 'Cardamom (Alleppey Green)', category: 'Spices', dailyRate: 28.50, unit: 'kg', trend: 'up', hsCode: '090831' },
    { id: 'c2', name: 'Black Pepper (MG1)', category: 'Spices', dailyRate: 6.80, unit: 'kg', trend: 'stable', hsCode: '090411' },
    { id: 'c3', name: 'Turmeric (Salem)', category: 'Spices', dailyRate: 1.95, unit: 'kg', trend: 'down', hsCode: '091030' },
    { id: 'c4', name: 'Basmati Rice (1121 Steam)', category: 'Grains', dailyRate: 1.45, unit: 'kg', trend: 'up', hsCode: '100630' },
    { id: 'c5', name: 'Cotton Yarn (30s combed)', category: 'Textiles', dailyRate: 3.20, unit: 'kg', trend: 'stable', hsCode: '520512' },
    { id: 'c6', name: 'Cumin Seeds (Singapore)', category: 'Spices', dailyRate: 4.25, unit: 'kg', trend: 'up', hsCode: '090930' },
    { id: 'c7', name: 'Coriander Seeds', category: 'Spices', dailyRate: 2.10, unit: 'kg', trend: 'stable', hsCode: '090921' },
    { id: 'c8', name: 'Chili Powder (Guntur)', category: 'Spices', dailyRate: 3.50, unit: 'kg', trend: 'up', hsCode: '090421' },
    { id: 'c9', name: 'Ginger (Cochin)', category: 'Spices', dailyRate: 2.80, unit: 'kg', trend: 'down', hsCode: '091010' },
    { id: 'c10', name: 'Cloves (Madagascar)', category: 'Spices', dailyRate: 12.50, unit: 'kg', trend: 'up', hsCode: '090710' },
    { id: 'c11', name: 'Cinnamon (Ceylon)', category: 'Spices', dailyRate: 8.75, unit: 'kg', trend: 'stable', hsCode: '090611' },
    { id: 'c12', name: 'Nutmeg (Kerala)', category: 'Spices', dailyRate: 15.20, unit: 'kg', trend: 'up', hsCode: '090810' },
    { id: 'c13', name: 'Saffron (Kashmir)', category: 'Spices', dailyRate: 450.00, unit: 'kg', trend: 'stable', hsCode: '091020' },
    { id: 'c14', name: 'Fennel Seeds', category: 'Spices', dailyRate: 3.80, unit: 'kg', trend: 'down', hsCode: '090950' },
    { id: 'c15', name: 'Mustard Seeds', category: 'Spices', dailyRate: 1.20, unit: 'kg', trend: 'stable', hsCode: '120750' },
  ];

  const statuses: InvoiceStatus[] = ['Quote', 'Unpaid', 'In-Transit', 'Paid'];
  const shippingPrefixes = ['MAEU', 'MSCU', 'OOLU', 'COSU', 'HLCU', 'CMAU', 'EGLV'];
  const ports = [
    { loading: 'Cochin (COK)', discharge: 'Dubai (DXB)' },
    { loading: 'Chennai (MAA)', discharge: 'Singapore (SIN)' },
    { loading: 'Mumbai (BOM)', discharge: 'Rotterdam (RTM)' },
    { loading: 'Kolkata (CCU)', discharge: 'Hamburg (HAM)' },
    { loading: 'Tuticorin (TUT)', discharge: 'Jebel Ali (JEA)' },
    { loading: 'Mundra (MUN)', discharge: 'Felixstowe (FXT)' },
    { loading: 'Nhava Sheva (NSA)', discharge: 'Los Angeles (LAX)' },
    { loading: 'Visakhapatnam (VTZ)', discharge: 'Tokyo (TYO)' },
  ];

  const incoterms = ['FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DAP'];

  const invoices: Invoice[] = [];
  const invoiceDetails: Record<string, InvoiceDetailData> = {};

  // Generate 75 invoices
  for (let i = 1; i <= 75; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const commodity = commodities[Math.floor(Math.random() * commodities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const port = ports[Math.floor(Math.random() * ports.length)];
    const incoterm = incoterms[Math.floor(Math.random() * incoterms.length)];
    
    const isQuote = status === 'Quote';
    const idPrefix = isQuote ? 'QT' : 'INV';
    const id = `${idPrefix}-2025-${String(900 - i).padStart(3, '0')}`;
    
    const qty = Math.floor(Math.random() * 2000) + 100;
    const baseAmount = commodity.dailyRate * qty;
    const margin = baseAmount * (Math.random() * 0.1 + 0.03);
    const freight = Math.floor(Math.random() * 2000) + 200;
    const amount = Math.round(baseAmount + margin + freight);
    
    // Generate dates
    const daysAgo = Math.floor(Math.random() * 90);
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - daysAgo);
    
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + (isQuote ? 7 : 30));
    
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const shippingId = status === 'Quote' ? '-' : 
      `${shippingPrefixes[Math.floor(Math.random() * shippingPrefixes.length)]}${Math.floor(Math.random() * 9000000) + 1000000}`;

    const invoice: Invoice = {
      id,
      companyName: company.name,
      companyInitial: company.initial,
      companyColor: company.color,
      companyTextColor: company.textColor,
      shippingId,
      issueDate: formatDate(issueDate),
      dueDate: isQuote ? `Valid until ${formatDate(dueDate)}` : formatDate(dueDate),
      amount,
      status,
      commodityName: commodity.name.split(' (')[0],
      destinationCountry: company.country,
    };

    invoices.push(invoice);

    // Generate detailed invoice data
    const detail: InvoiceDetailData = {
      ...invoice,
      billFrom: {
        name: 'IndoExport Traders Ltd',
        email: 'exports@indoexport.in',
        address: '42, Spice Market Road, Kochi,\nKerala 682002, India',
        phone: '+91 484 255 9911',
        taxId: 'IEC: AAACI1234Q'
      },
      billTo: {
        name: company.name,
        email: company.email,
        address: `${company.country} Business District`,
        phone: '+' + Math.floor(Math.random() * 900000000000 + 100000000000),
      },
      items: [
        {
          id: '1',
          description: commodity.name,
          hsCode: commodity.hsCode,
          packaging: `${Math.ceil(qty / 50)}x 50kg Bags`,
          price: commodity.dailyRate * 1.05,
          qty,
          unit: commodity.unit,
        }
      ],
      subTotal: baseAmount,
      tax: 0,
      freightCost: freight,
      commission: margin,
      total: amount,
      note: `${isQuote ? 'Quote' : 'Invoice'} based on current market rates. ${isQuote ? 'Rate valid for 7 days due to market fluctuation.' : ''} Payment Terms: ${isQuote ? '30% Advance, Balance against BL' : 'Net 30 days'}.`,
      incoterms: `${incoterm} ${port.discharge.split(' ')[0]}`,
      portOfLoading: port.loading,
      portOfDischarge: port.discharge,
    };

    invoiceDetails[id] = detail;
  }

  return { invoices, invoiceDetails, commodities };
};

// Generate mock users
const generateMockUsers = (): User[] => [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@indoexport.in',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkS7xkdmrK-_Z6BMsQNWUxLkdqOz8lyJsLtXrMsSotvKGR2QxfIIT5P72BvCeUe7VcAbmufnRTKArht8r9EzSI-fBBcWYZpXXGrSMqRAwL-1hmlgpLcSKC3tq6pNeyMDmTbLowJP2CB0PsqeiMnpYXsJsOLsrxOJb2sNTjVUYOe5Bi5A988FGMZja1CVG73EaokuI-rB5dnnYll4Y7eION_i5Ws67Nngr8vPBv66oBZaT-l1AUz1vRPJsWfIBWg05aEHHnkjNblS7f',
    role: 'Admin',
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah.chen@indoexport.in',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff',
    role: 'Manager',
  },
  {
    id: 'u3',
    name: 'Raj Patel',
    email: 'raj.patel@indoexport.in',
    avatar: 'https://ui-avatars.com/api/?name=Raj+Patel&background=10b981&color=fff',
    role: 'Agent',
  },
  {
    id: 'u4',
    name: 'Maria Garcia',
    email: 'maria.garcia@indoexport.in',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=f59e0b&color=fff',
    role: 'Agent',
  },
];

// Generate mock activities
const generateMockActivities = (invoices: Invoice[]): Activity[] => {
  const activities: Activity[] = [];
  const users = generateMockUsers();
  const activityTypes: Activity['type'][] = ['created', 'updated', 'status_changed', 'comment', 'payment', 'shipped', 'delivered'];
  
  invoices.slice(0, 30).forEach((invoice, idx) => {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    
    activities.push({
      id: `act-${idx}`,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      invoiceId: invoice.id,
      userId: user.id,
      userName: user.name,
      description: `${user.name} ${['created', 'updated', 'reviewed', 'approved'][Math.floor(Math.random() * 4)]} invoice ${invoice.id}`,
      timestamp: timestamp.toISOString(),
    });
  });
  
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock notifications
const generateMockNotifications = (): Notification[] => [
  {
    id: 'n1',
    type: 'warning',
    title: 'Quote Expiring Soon',
    message: 'QT-2025-001 for Global Spice Traders expires in 2 days',
    read: false,
    createdAt: new Date().toISOString(),
    link: 'QT-2025-001',
  },
  {
    id: 'n2',
    type: 'success',
    title: 'Payment Received',
    message: 'INV-2025-891 payment of $6,800 confirmed',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: 'INV-2025-891',
  },
  {
    id: 'n3',
    type: 'info',
    title: 'Shipment Update',
    message: 'INV-2025-892 has departed from Cochin port',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    link: 'INV-2025-892',
  },
  {
    id: 'n4',
    type: 'error',
    title: 'Payment Overdue',
    message: 'INV-2025-889 is 5 days past due date',
    read: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    link: 'INV-2025-889',
  },
  {
    id: 'n5',
    type: 'info',
    title: 'New Quote Request',
    message: 'Singapore Commodities requested a quote for Cardamom',
    read: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Generate AI insights
const generateMockInsights = (): AIInsight[] => [
  {
    id: 'ai1',
    type: 'recommendation',
    title: 'Optimize Cardamom Pricing',
    description: 'Market rates for Cardamom have increased 12% this month. Consider updating your quote margins to capture additional profit.',
    priority: 'high',
    actionable: true,
    action: 'Review Cardamom Quotes',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ai2',
    type: 'alert',
    title: 'Payment Risk Detected',
    description: 'Textile Hub Vietnam has 2 overdue invoices totaling $64,000. Consider requiring advance payment for new orders.',
    priority: 'high',
    actionable: true,
    action: 'View Customer Profile',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ai3',
    type: 'prediction',
    title: 'Q1 Revenue Forecast',
    description: 'Based on current pipeline and historical trends, projected Q1 revenue is $485,000 (+18% YoY).',
    priority: 'medium',
    actionable: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ai4',
    type: 'trend',
    title: 'UAE Market Growing',
    description: 'Orders from UAE have increased 35% in the last 3 months. Consider expanding your buyer network in this region.',
    priority: 'medium',
    actionable: true,
    action: 'View UAE Analytics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ai5',
    type: 'recommendation',
    title: 'Bundle Opportunity',
    description: 'Global Spice Traders frequently orders Cardamom and Black Pepper together. Create a bundled pricing offer.',
    priority: 'low',
    actionable: true,
    action: 'Create Bundle',
    createdAt: new Date().toISOString(),
  },
];

// Initial state factory
const createInitialState = (): AppState => {
  const { invoices, invoiceDetails, commodities } = generateMockData();
  const users = generateMockUsers();
  
  return {
    currentUser: users[0],
    users,
    isAuthenticated: true,
    
    invoices,
    invoiceDetails,
    commodities,
    
    selectedInvoiceId: invoices[0]?.id || null,
    viewMode: 'list',
    filters: {
      search: '',
      status: 'All',
      dateRange: null,
      amountRange: null,
      commodity: 'All',
      destination: 'All',
    },
    sortField: 'issueDate',
    sortDirection: 'desc',
    currentPage: 1,
    pageSize: 10,
    selectedIds: [],
    
    comments: [],
    activities: generateMockActivities(invoices),
    notifications: generateMockNotifications(),
    
    insights: generateMockInsights(),
    
    settings: {
      theme: 'light',
      notifications: true,
      emailAlerts: true,
      currency: 'USD',
      dateFormat: 'MMM DD, YYYY',
      compactView: false,
    },
    
    isCommandPaletteOpen: false,
    isQuoteModalOpen: false,
    isSettingsOpen: false,
    isNotificationsOpen: false,
    isSidebarOpen: false,
    activeNavItem: 'Invoices & Billing',
  };
};

// Load state from localStorage
export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return createInitialState();
    }
    const parsed = JSON.parse(serializedState);
    // Merge with initial state to ensure all fields exist
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
};

// Save state to localStorage
export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch {
    // Ignore write errors
  }
};

// Reset state
export const resetState = (): AppState => {
  localStorage.removeItem(STORAGE_KEY);
  return createInitialState();
};

// Action types
export type AppAction =
  | { type: 'SET_SELECTED_INVOICE'; payload: string | null }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_SORT'; payload: { field: SortField; direction: SortDirection } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'TOGGLE_SELECT'; payload: string }
  | { type: 'SELECT_ALL'; payload: string[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: { id: string; updates: Partial<Invoice> } }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'DELETE_INVOICES'; payload: string[] }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'SET_COMMENTS'; payload: Comment[] }
  | { type: 'SET_ACTIVITIES'; payload: Activity[] }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'DISMISS_INSIGHT'; payload: string }
  | { type: 'SET_INSIGHTS'; payload: AIInsight[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_COMMAND_PALETTE' }
  | { type: 'TOGGLE_QUOTE_MODAL' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_NAV'; payload: string }
  | { type: 'SET_INVOICES'; payload: { invoices: Invoice[]; invoiceDetails: Record<string, InvoiceDetailData> } }
  | { type: 'RESET_STATE' };

// Reducer
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_SELECTED_INVOICE':
      return { ...state, selectedInvoiceId: action.payload };
    
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, currentPage: 1 };
    
    case 'SET_SORT':
      return { ...state, sortField: action.payload.field, sortDirection: action.payload.direction };
    
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, currentPage: 1 };
    
    case 'TOGGLE_SELECT': {
      const id = action.payload;
      const isSelected = state.selectedIds.includes(id);
      return {
        ...state,
        selectedIds: isSelected
          ? state.selectedIds.filter(i => i !== id)
          : [...state.selectedIds, id],
      };
    }
    
    case 'SELECT_ALL':
      return { ...state, selectedIds: action.payload };
    
    case 'CLEAR_SELECTION':
      return { ...state, selectedIds: [] };
    
    case 'ADD_INVOICE':
      return { ...state, invoices: [action.payload, ...state.invoices] };
    
    case 'UPDATE_INVOICE': {
      const { id, updates } = action.payload;
      return {
        ...state,
        invoices: state.invoices.map(inv =>
          inv.id === id ? { ...inv, ...updates } : inv
        ),
      };
    }
    
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(inv => inv.id !== action.payload),
        selectedIds: state.selectedIds.filter(id => id !== action.payload),
      };
    
    case 'DELETE_INVOICES':
      return {
        ...state,
        invoices: state.invoices.filter(inv => !action.payload.includes(inv.id)),
        selectedIds: [],
      };
    
    case 'ADD_COMMENT':
      return { ...state, comments: [action.payload, ...state.comments] };
    
    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities] };
    
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };
    
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'DISMISS_INSIGHT':
      return {
        ...state,
        insights: state.insights.filter(i => i.id !== action.payload),
      };
    
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
    
    case 'SET_INVOICES':
      return {
        ...state,
        invoices: action.payload.invoices,
        invoiceDetails: action.payload.invoiceDetails,
        selectedInvoiceId: action.payload.invoices[0]?.id || null,
      };
    
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    
    case 'TOGGLE_THEME':
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: state.settings.theme === 'light' ? 'dark' : 'light',
        },
      };
    
    case 'TOGGLE_COMMAND_PALETTE':
      return { ...state, isCommandPaletteOpen: !state.isCommandPaletteOpen };
    
    case 'TOGGLE_QUOTE_MODAL':
      return { ...state, isQuoteModalOpen: !state.isQuoteModalOpen };
    
    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };
    
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, isNotificationsOpen: !state.isNotificationsOpen };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    
    case 'SET_ACTIVE_NAV':
      return { ...state, activeNavItem: action.payload };
    
    case 'RESET_STATE':
      return resetState();
    
    default:
      return state;
  }
};

// Selectors
export const getFilteredInvoices = (state: AppState): Invoice[] => {
  let filtered = [...state.invoices];
  
  // Search filter
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    filtered = filtered.filter(inv =>
      inv.id.toLowerCase().includes(search) ||
      inv.companyName.toLowerCase().includes(search) ||
      inv.commodityName.toLowerCase().includes(search) ||
      inv.destinationCountry.toLowerCase().includes(search)
    );
  }
  
  // Status filter
  if (state.filters.status !== 'All') {
    filtered = filtered.filter(inv => inv.status === state.filters.status);
  }
  
  // Commodity filter
  if (state.filters.commodity !== 'All') {
    filtered = filtered.filter(inv => inv.commodityName === state.filters.commodity);
  }
  
  // Destination filter
  if (state.filters.destination !== 'All') {
    filtered = filtered.filter(inv => inv.destinationCountry === state.filters.destination);
  }
  
  // Amount range filter
  if (state.filters.amountRange) {
    filtered = filtered.filter(inv =>
      inv.amount >= state.filters.amountRange!.min &&
      inv.amount <= state.filters.amountRange!.max
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (state.sortField) {
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'companyName':
        comparison = a.companyName.localeCompare(b.companyName);
        break;
      case 'issueDate':
        comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return state.sortDirection === 'asc' ? comparison : -comparison;
  });
  
  return filtered;
};

export const getPaginatedInvoices = (state: AppState): Invoice[] => {
  const filtered = getFilteredInvoices(state);
  const start = (state.currentPage - 1) * state.pageSize;
  return filtered.slice(start, start + state.pageSize);
};

export const getTotalPages = (state: AppState): number => {
  const filtered = getFilteredInvoices(state);
  return Math.ceil(filtered.length / state.pageSize);
};

export const getStats = (state: AppState) => {
  const invoices = state.invoices;
  
  const quotes = invoices.filter(i => i.status === 'Quote');
  const inTransit = invoices.filter(i => i.status === 'In-Transit');
  const paid = invoices.filter(i => i.status === 'Paid');
  const unpaid = invoices.filter(i => i.status === 'Unpaid');
  
  return {
    activeQuotes: {
      count: quotes.length,
      amount: quotes.reduce((sum, i) => sum + i.amount, 0),
    },
    inTransit: {
      count: inTransit.length,
      amount: inTransit.reduce((sum, i) => sum + i.amount, 0),
    },
    commissions: {
      count: paid.length,
      amount: paid.reduce((sum, i) => sum + i.amount * 0.05, 0), // 5% commission
    },
    pendingActions: {
      count: unpaid.length + quotes.length,
      amount: unpaid.length + quotes.length,
    },
  };
};

export const getUnreadNotificationCount = (state: AppState): number => {
  return state.notifications.filter(n => !n.read).length;
};

export const getUniqueDestinations = (state: AppState): string[] => {
  return [...new Set(state.invoices.map(i => i.destinationCountry))].sort();
};

export const getUniqueCommodities = (state: AppState): string[] => {
  return [...new Set(state.invoices.map(i => i.commodityName))].sort();
};

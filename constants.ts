import { Invoice, InvoiceDetailData, Commodity } from './types';

export const COMMODITIES: Commodity[] = [
  { id: 'c1', name: 'Cardamom (Alleppey Green)', category: 'Spices', dailyRate: 28.50, unit: 'kg', trend: 'up', hsCode: '090831' },
  { id: 'c2', name: 'Black Pepper (MG1)', category: 'Spices', dailyRate: 6.80, unit: 'kg', trend: 'stable', hsCode: '090411' },
  { id: 'c3', name: 'Turmeric (Salem)', category: 'Spices', dailyRate: 1.95, unit: 'kg', trend: 'down', hsCode: '091030' },
  { id: 'c4', name: 'Basmati Rice (1121 Steam)', category: 'Grains', dailyRate: 1.45, unit: 'kg', trend: 'up', hsCode: '100630' },
  { id: 'c5', name: 'Cotton Yarn (30s combed)', category: 'Textiles', dailyRate: 3.20, unit: 'kg', trend: 'stable', hsCode: '520512' },
];

export const INVOICES: Invoice[] = [
  {
    id: 'QT-2025-001',
    companyName: 'Global Spice Traders LLC',
    companyInitial: 'G',
    companyColor: 'bg-green-100',
    companyTextColor: 'text-green-700',
    shippingId: '-',
    issueDate: 'Oct 24, 2025',
    dueDate: 'Valid until Oct 31',
    amount: 14250.00,
    status: 'Quote',
    commodityName: 'Cardamom (Alleppey Green)',
    destinationCountry: 'UAE'
  },
  {
    id: 'INV-2025-892',
    companyName: 'EuroFoods Import GmbH',
    companyInitial: 'E',
    companyColor: 'bg-blue-100',
    companyTextColor: 'text-blue-700',
    shippingId: 'MAEU9283746',
    issueDate: 'Oct 20, 2025',
    dueDate: 'Nov 20, 2025',
    amount: 34000.00,
    status: 'In-Transit',
    commodityName: 'Basmati Rice',
    destinationCountry: 'Germany'
  },
  {
    id: 'INV-2025-891',
    companyName: 'Oman Trading Co.',
    companyInitial: 'O',
    companyColor: 'bg-orange-100',
    companyTextColor: 'text-orange-700',
    shippingId: 'MSCU1827364',
    issueDate: 'Oct 18, 2025',
    dueDate: 'Oct 25, 2025',
    amount: 6800.00,
    status: 'Paid',
    commodityName: 'Black Pepper',
    destinationCountry: 'Oman'
  },
  {
    id: 'QT-2025-004',
    companyName: 'US Organic Spices',
    companyInitial: 'U',
    companyColor: 'bg-purple-100',
    companyTextColor: 'text-purple-700',
    shippingId: '-',
    issueDate: 'Oct 24, 2025',
    dueDate: 'Valid until Oct 26',
    amount: 5850.00,
    status: 'Quote',
    commodityName: 'Turmeric (Salem)',
    destinationCountry: 'USA'
  },
  {
    id: 'INV-2025-889',
    companyName: 'Textile Hub Vietnam',
    companyInitial: 'T',
    companyColor: 'bg-indigo-100',
    companyTextColor: 'text-indigo-700',
    shippingId: 'OOLU9988776',
    issueDate: 'Oct 15, 2025',
    dueDate: 'Oct 30, 2025',
    amount: 64000.00,
    status: 'Unpaid',
    commodityName: 'Cotton Yarn',
    destinationCountry: 'Vietnam'
  },
];

export const SELECTED_INVOICE_DETAIL: InvoiceDetailData = {
  ...INVOICES[0], // The Quote for Cardamom
  billFrom: {
    name: 'IndoExport Traders Ltd',
    email: 'exports@indoexport.in',
    address: '42, Spice Market Road, Kochi,\nKerala 682002, India',
    phone: '+91 484 255 9911',
    taxId: 'IEC: AAACI1234Q'
  },
  billTo: {
    name: 'Global Spice Traders LLC',
    email: 'procurement@globalspices.ae',
    address: 'Al Quoz Industrial Area 4,\nDubai, UAE',
    phone: '+971 50 123 4567'
  },
  items: [
    {
      id: '1',
      description: 'Alleppey Green Cardamom (8mm Bold)',
      hsCode: '090831',
      packaging: '5kg Vacuum Pack x 100',
      price: 28.50, // Base rate + margin
      qty: 500,
      unit: 'kg'
    }
  ],
  subTotal: 14250.00,
  tax: 0.00, // Export is typically zero-rated for GST with LUT
  freightCost: 450.00, // Air Freight estimate
  commission: 712.50, // 5% internal visibility
  total: 14700.00,
  note: 'Quote based on today\'s market rate of $27.00/kg + Commission. Rate valid for 48 hours due to market fluctuation. Payment Terms: 30% Advance, Balance against BL.',
  incoterms: 'CIF Dubai Air Port',
  portOfLoading: 'Cochin (COK)',
  portOfDischarge: 'Dubai (DXB)'
};
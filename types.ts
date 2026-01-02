export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Quote' | 'In-Transit';

export interface Commodity {
  id: string;
  name: string;
  category: string;
  dailyRate: number; // Price per unit (e.g., kg)
  unit: string;
  trend: 'up' | 'down' | 'stable';
  hsCode: string;
}

export interface Invoice {
  id: string;
  companyName: string; // The Buyer
  companyInitial: string;
  companyColor: string;
  companyTextColor: string;
  shippingId: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  commodityName: string; // Main item for list view
  destinationCountry: string;
}

export interface LineItem {
  id: string;
  description: string;
  hsCode: string;
  packaging: string; // e.g., "50kg Jute Bags"
  price: number; // Unit price including margin
  qty: number;
  unit: string;
}

export interface InvoiceDetailData extends Invoice {
  billFrom: {
    name: string;
    email: string;
    address: string;
    phone: string;
    taxId: string; // GST/IEC
  };
  billTo: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: LineItem[];
  subTotal: number;
  tax: number; // IGST etc
  freightCost: number;
  commission: number; // Internal tracking
  total: number;
  note: string;
  incoterms: string; // FOB, CIF, etc.
  portOfLoading: string;
  portOfDischarge: string;
}
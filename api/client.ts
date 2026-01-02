// API Client for ShipNow Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface ApiError {
  detail: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('shipnow_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('shipnow_token', token);
    } else {
      localStorage.removeItem('shipnow_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;
    
    return JSON.parse(text);
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async signup(email: string, name: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  logout() {
    this.setToken(null);
  }

  // Invoice endpoints
  async getInvoices(status?: string, search?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/invoices${query}`);
  }

  async getInvoice(id: string): Promise<any> {
    return this.request<any>(`/invoices/${id}`);
  }

  async createInvoice(invoice: any): Promise<any> {
    return this.request<any>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }

  async updateInvoice(id: string, updates: any): Promise<any> {
    return this.request<any>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.request<void>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getComments(invoiceId: string): Promise<any[]> {
    return this.request<any[]>(`/invoices/${invoiceId}/comments`);
  }

  async addComment(invoiceId: string, content: string): Promise<any> {
    return this.request<any>(`/invoices/${invoiceId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Activities
  async getActivities(invoiceId: string): Promise<any[]> {
    return this.request<any[]>(`/invoices/${invoiceId}/activities`);
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    return this.request<any[]>('/notifications');
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead(): Promise<void> {
    return this.request<void>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    return this.request<any>('/analytics');
  }

  // AI Insights
  async getAIInsights(query?: string): Promise<any[]> {
    const params = query ? `?query=${encodeURIComponent(query)}` : '';
    return this.request<any[]>(`/ai/insights${params}`);
  }

  // Email
  async sendInvoiceEmail(
    invoiceId: string,
    toEmail: string,
    message?: string,
    includePdf: boolean = true
  ): Promise<any> {
    return this.request<any>(`/invoices/${invoiceId}/send-email`, {
      method: 'POST',
      body: JSON.stringify({
        to_email: toEmail,
        message,
        include_pdf: includePdf,
      }),
    });
  }

  // PDF
  async downloadInvoicePdf(invoiceId: string): Promise<Blob> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pdf`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    return response.blob();
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/healthz');
  }
}

export const apiClient = new ApiClient();
export default apiClient;

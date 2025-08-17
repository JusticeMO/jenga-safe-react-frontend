const API_BASE_URL = 'http://localhost:8000/api';

// API client with token management
class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async requestOTP(input: string, password: string, role: 'tenant' | 'landlord') {
    return this.request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ input, password, role }),
    });
  }

  async login(input: string, password: string, otp: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ input, password, otp }),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role: 'tenant' | 'landlord';
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getUser() {
    return this.request('/auth/user');
  }

  async updateProfile(data: { name?: string; phone?: string; profile_picture?: string }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Dashboard endpoints
  async getDashboard() {
    return this.request('/dashboard');
  }

  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Property endpoints
  async getProperties() {
    return this.request('/properties');
  }

  async getProperty(id: string) {
    return this.request(`/properties/${id}`);
  }

  async createProperty(data: any) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: any) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string) {
    return this.request(`/properties/${id}`, { method: 'DELETE' });
  }

  // Payment endpoints
  async getPayments() {
    return this.request('/payments');
  }

  async getPaymentHistory() {
    return this.request('/payments/history');
  }

  async createPayment(data: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markPaymentCompleted(id: string, data: any) {
    return this.request(`/payments/${id}/mark-completed`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Message endpoints
  async getMessages() {
    return this.request('/messages');
  }

  async sendMessage(data: any) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markMessageRead(id: string) {
    return this.request(`/messages/${id}/mark-read`, { method: 'POST' });
  }

  async getUnreadCount() {
    return this.request('/messages/unread-count');
  }

  // Maintenance request endpoints
  async getMaintenanceRequests() {
    return this.request('/maintenance-requests');
  }

  async createMaintenanceRequest(data: any) {
    return this.request('/maintenance-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenanceRequest(id: string, data: any) {
    return this.request(`/maintenance-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Bill endpoints
  async getBills() {
    return this.request('/bills');
  }

  async markBillPaid(id: string, data: any) {
    return this.request(`/bills/${id}/mark-paid`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tenant-specific endpoints
  async getMyUnit() {
    return this.request('/tenant/property-unit');
  }

  async getMyPayments() {
    return this.request('/tenant/payments');
  }

  async getMyBills() {
    return this.request('/tenant/bills');
  }

  async getMyMaintenanceRequests() {
    return this.request('/tenant/maintenance-requests');
  }

  async getMyMessages() {
    return this.request('/tenant/messages');
  }

  // Landlord-specific endpoints
  async getMyProperties() {
    return this.request('/landlord/properties');
  }

  async getMyTenants() {
    return this.request('/landlord/tenants');
  }

  async getLandlordMaintenanceRequests() {
    return this.request('/landlord/maintenance-requests');
  }

  async getLandlordPayments() {
    return this.request('/landlord/payments');
  }

  async getReports() {
    return this.request('/landlord/reports');
  }
}

export const apiClient = new ApiClient();
export default apiClient;


import { ApiResponse } from "@/types/api";
import {
  User,
  Property,
  Payment,
  Message,
  MaintenanceRequest,
  Bill,
  UserRole,
  Complaint,
  GarbageServiceHistory,
  WaterUsageHistory,
  ChatMessage,
  Dashboard,
  DashboardStats,
  Unit,
  Report,
  EmergencyContact,
} from "@/types";

// Allow overriding the API base URL via Vite env var. Falls back to localhost.
// `import.meta.env` typings may vary, cast `import.meta` to any for broad compatibility.
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000/api";

// API client with token management
class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    console.log("ApiClient initialized with token:", this.token);
  }

  setToken(token: string) {
    console.log("Setting token:", token);
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    console.log("Clearing token");
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    console.log(`Making request to: ${endpoint}`, options);
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Auto-logout on expired / invalid token
      if (response.status === 401) {
        this.clearToken();
        // Hard redirect to ensure full reset
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      const responseData = await response.json();
      console.log(`Response from ${endpoint}:`, responseData);

      if (!response.ok) {
        console.error(`HTTP error from ${endpoint}:`, response.status, responseData);
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error(`Error during request to ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(input: string, password: string, role: UserRole): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log("Logging in with:", { input, role });
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ input, password, role }),
    });

    // Token may be at top level (preferred) or nested in data for legacy responses
    const token = (response as any).token ?? response.data?.token;
    if (response.success && token) {
      this.setToken(token);
    }

    return response;
  }

  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role: UserRole;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log("Registering user:", data);
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const token = (response as any).token ?? response.data?.token;
    if (response.success && token) {
      this.setToken(token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<null>> {
    console.log("Logging out");
    try {
      return await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getUser(): Promise<ApiResponse<{ user: User }>> {
    console.log("Getting user");
    return this.request<{ user: User }>('/auth/user');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    console.log("Updating profile with:", data);
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async startConversation(data: { recipientId: string | number; subject: string; content: string }): Promise<ApiResponse<Message>> {
    return this.request<Message>('/messages/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard endpoints
  async getDashboard(): Promise<ApiResponse<Dashboard>> {
    return this.request<Dashboard>('/dashboard');
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  // Property endpoints
  async getProperties(): Promise<ApiResponse<Property[]>> {
    return this.request<Property[]>('/properties');
  }

  async getProperty(id: string | number): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/properties/${id}`);
  }

  async createProperty(data: Partial<Property>): Promise<ApiResponse<Property>> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string | number, data: Partial<Property>): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string | number): Promise<ApiResponse<null>> {
    return this.request<null>(`/properties/${id}`, { method: 'DELETE' });
  }

  // Payment endpoints
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/payments');
  }

  async getPaymentHistory(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/payments/history');
  }

  async createPayment(data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markPaymentCompleted(id: string | number, data: { receipt: string }): Promise<ApiResponse<Payment>> {
    return this.request<Payment>(`/payments/${id}/mark-completed`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Message endpoints
  async getMessages(): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>('/messages');
  }

  async getMessagesForConversation(conversationId: string | number): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/messages/${conversationId}`);
  }

  async sendMessage(data: Partial<Message>): Promise<ApiResponse<Message>> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markMessageRead(id: string | number): Promise<ApiResponse<Message>> {
    return this.request<Message>(`/messages/${id}/mark-read`, { method: 'POST' });
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>('/messages/unread-count');
  }

  // Maintenance request endpoints
  async getMaintenanceRequests(): Promise<ApiResponse<MaintenanceRequest[]>> {
    return this.request<MaintenanceRequest[]>('/maintenance-requests');
  }

  async createMaintenanceRequest(data: Partial<MaintenanceRequest>): Promise<ApiResponse<MaintenanceRequest>> {
    return this.request<MaintenanceRequest>('/maintenance-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenanceRequest(id: string | number, data: Partial<MaintenanceRequest>): Promise<ApiResponse<MaintenanceRequest>> {
    return this.request<MaintenanceRequest>(`/maintenance-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Bill endpoints
  async getBills(): Promise<ApiResponse<Bill[]>> {
    return this.request<Bill[]>('/bills');
  }

  async markBillPaid(id: string | number, data: { transaction_id: string }): Promise<ApiResponse<Bill>> {
    return this.request<Bill>(`/bills/${id}/mark-paid`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tenant-specific endpoints
  async getMyUnit(): Promise<ApiResponse<Unit>> {
    return this.request<Unit>('/tenant/property-unit');
  }

  async getMyPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/tenant/payments');
  }

  async getMyBills(): Promise<ApiResponse<Bill[]>> {
    return this.request<Bill[]>('/tenant/bills');
  }

  async getMyMaintenanceRequests(): Promise<ApiResponse<MaintenanceRequest[]>> {
    return this.request<MaintenanceRequest[]>('/tenant/maintenance-requests');
  }

  async getMyMessages(): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>('/tenant/messages');
  }

  // Landlord-specific endpoints
  async getMyProperties(): Promise<ApiResponse<Property[]>> {
    return this.request<Property[]>('/landlord/properties');
  }

  async getMyTenants(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/landlord/tenants');
  }

  async getLandlordMaintenanceRequests(): Promise<ApiResponse<MaintenanceRequest[]>> {
    return this.request<MaintenanceRequest[]>('/landlord/maintenance-requests');
  }

  async getLandlordPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/landlord/payments');
  }

  async getReports(): Promise<ApiResponse<Report>> {
    return this.request<Report>('/landlord/reports');
  }

  async getDocuments(): Promise<ApiResponse<Document[]>> {
    return this.request<Document[]>('/documents');
  }

  async getEmergencyContacts(): Promise<ApiResponse<EmergencyContact[]>> {
    return this.request<EmergencyContact[]>('/emergency-contacts');
  }

  async initiateSTKPush(data: { amount: number; phoneNumber: string }): Promise<ApiResponse<null>> {
    return this.request<null>('/payments/stk-push', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async fileComplaint(data: Partial<Complaint>): Promise<ApiResponse<Complaint>> {
    return this.request<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGarbageServiceHistory(): Promise<ApiResponse<GarbageServiceHistory[]>> {
    return this.request<GarbageServiceHistory[]>('/garbage-service-history');
  }

  async getAvailableProperties(): Promise<ApiResponse<Property[]>> {
    return this.request<Property[]>('/properties/available');
  }

  async getChatMessages(): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>('/chat/messages');
  }

  async sendChatMessage(data: { content: string }): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWaterUsageHistory(): Promise<ApiResponse<WaterUsageHistory[]>> {
    return this.request<WaterUsageHistory[]>('/water-usage-history');
  }
}

export const apiClient = new ApiClient();
export default apiClient;

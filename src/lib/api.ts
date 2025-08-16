const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // KYC OTP endpoints
  async sendKYCOTP(data: {
    phone: string;
    userType: 'applicant' | 'recruiter';
  }) {
    return this.request('/auth/kyc/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyKYCOTP(data: {
    phone: string;
    userType: 'applicant' | 'recruiter';
    otp: string;
    userId: string;
  }) {
    return this.request('/auth/kyc/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Auth endpoints
  async registerApplicant(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    currentRole: string;
    yearsOfExperience?: number;
    preferredWorkType?: string[];
  }) {
    return this.request('/auth/register/applicant', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerRecruiter(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    currentRole: string;
    company: {
      name: string;
      industry: string;
      size: string;
    };
    department?: string;
  }) {
    return this.request('/auth/register/recruiter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: {
    email: string;
    password: string;
    userType: 'applicant' | 'recruiter';
  }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Dashboard endpoints
  async getApplicantDashboard(userId: string) {
    return this.request(`/dashboard/applicant/${userId}`);
  }

  async getRecruiterDashboard(userId: string) {
    return this.request(`/dashboard/recruiter/${userId}`);
  }

  async getPlatformAnalytics() {
    return this.request('/dashboard/analytics');
  }

  // Admin endpoints
  async adminLogin(data: {
    username: string;
    password: string;
  }) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminUsers(params?: {
    page?: number;
    limit?: number;
    type?: 'applicant' | 'recruiter';
    search?: string;
    status?: 'active' | 'inactive';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    return this.request(`/admin/users?${queryParams.toString()}`);
  }

  async updateUserStatus(userId: string, data: {
    isActive: boolean;
    userType: 'applicant' | 'recruiter';
  }) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Profile endpoints
  async getApplicantProfile(userId: string) {
    return this.request(`/applicants/${userId}`);
  }

  async updateApplicantProfile(userId: string, data: any) {
    return this.request(`/applicants/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getRecruiterProfile(userId: string) {
    return this.request(`/recruiters/${userId}`);
  }

  async updateRecruiterProfile(userId: string, data: any) {
    return this.request(`/recruiters/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Utility methods
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

export const apiService = new ApiService();
export default apiService;


import apiClient from './api';

const API_URL = '/linked-apps';

export interface LinkedAppMetadata {
  features?: string[];
  stats?: {
    users?: string;
    photos?: string;
    rating?: string;
    satisfaction?: string;
  };
  story?: string;
  capabilities?: string[];
}

export interface LinkedApp {
  _id: string;
  name: string;
  url: string;
  description?: string;
  icon?: string;
  image?: string;
  category?: string;
  isActive: boolean;
  order: number;
  openInNewTab: boolean;
  metadata?: LinkedAppMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkedAppData {
  name: string;
  url: string;
  description?: string;
  icon?: string;
  image?: string;
  category?: string;
  isActive?: boolean;
  order?: number;
  openInNewTab?: boolean;
  metadata?: LinkedAppMetadata;
}

export interface UpdateLinkedAppData {
  name?: string;
  url?: string;
  description?: string;
  icon?: string;
  image?: string;
  category?: string;
  isActive?: boolean;
  order?: number;
  openInNewTab?: boolean;
  metadata?: LinkedAppMetadata;
}

export interface LinkedAppResponse {
  success: boolean;
  message: string;
  data: LinkedApp;
}

export interface LinkedAppListResponse {
  success: boolean;
  message: string;
  data: LinkedApp[];
}

class LinkedAppService {
  async getLinkedApps(): Promise<LinkedAppListResponse> {
    const response = await apiClient.get(API_URL);
    return response.data;
  }

  async getLinkedAppsAdmin(): Promise<LinkedAppListResponse> {
    const response = await apiClient.get(`${API_URL}/admin`);
    return response.data;
  }

  async getLinkedAppById(id: string): Promise<LinkedAppResponse> {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  }

  async getLinkedAppsByCategory(category: string): Promise<LinkedAppListResponse> {
    const response = await apiClient.get(`${API_URL}/category/${category}`);
    return response.data;
  }

  async createLinkedApp(data: CreateLinkedAppData): Promise<LinkedAppResponse> {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  }

  async updateLinkedApp(id: string, data: UpdateLinkedAppData): Promise<LinkedAppResponse> {
    const response = await apiClient.patch(`${API_URL}/${id}`, data);
    return response.data;
  }

  async deleteLinkedApp(id: string): Promise<LinkedAppResponse> {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  }
}

export const linkedAppService = new LinkedAppService();

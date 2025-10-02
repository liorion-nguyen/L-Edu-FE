import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/dashboard/categories`;

export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  courseCount: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  order?: number;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
}

export interface CategoryResponse {
  data: Category;
}

export interface CategoryStatsResponse {
  data: {
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    totalCourses: number;
  };
}

export interface UploadResponse {
  data: {
    url: string;
  };
}

class CategoryService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private getFormDataHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  async getCategories(params?: CategoryQueryParams): Promise<CategoryListResponse> {
    const response = await axios.get(API_URL, {
      headers: this.getAuthHeaders(),
      params,
    });
    return response.data;
  }

  // Public endpoint for students - no authentication required
  async getPublicCategories(): Promise<{ data: Category[] }> {
    const response = await axios.get(`${envConfig.serverURL}/courses/categories`);
    return response.data;
  }

  async getCategory(id: string): Promise<CategoryResponse> {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createCategory(data: CreateCategoryData): Promise<CategoryResponse> {
    const response = await axios.post(API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateCategory(id: string, data: UpdateCategoryData): Promise<CategoryResponse> {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getCategoryStats(): Promise<CategoryStatsResponse> {
    const response = await axios.get(`${API_URL}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async uploadIcon(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload/icon`, formData, {
      headers: this.getFormDataHeaders(),
    });
    return response.data;
  }

  async deleteIcon(url: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/icon/${encodeURIComponent(url)}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const categoryService = new CategoryService();

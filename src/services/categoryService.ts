import apiClient from './api';

const API_URL = '/dashboard/categories';

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
  async getCategories(params?: CategoryQueryParams): Promise<CategoryListResponse> {
    const response = await apiClient.get(API_URL, { params });
    return response.data;
  }

  async getPublicCategories(): Promise<{ data: Category[] }> {
    const response = await apiClient.get('/courses/categories');
    return response.data;
  }

  async getCategory(id: string): Promise<CategoryResponse> {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryData): Promise<CategoryResponse> {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  }

  async updateCategory(id: string, data: UpdateCategoryData): Promise<CategoryResponse> {
    const response = await apiClient.patch(`${API_URL}/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  }

  async getCategoryStats(): Promise<CategoryStatsResponse> {
    const response = await apiClient.get(`${API_URL}/stats`);
    return response.data;
  }

  async uploadIcon(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`${API_URL}/upload/icon`, formData, {
      headers: { 'Content-Type': undefined as any },
    });
    return response.data;
  }

  async deleteIcon(url: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`${API_URL}/icon/${encodeURIComponent(url)}`);
    return response.data;
  }
}

export const categoryService = new CategoryService();

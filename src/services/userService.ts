import apiClient from './api';

const API_BASE_URL = '/dashboard/users';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  phone?: string;
  role: 'ADMIN' | 'STUDENT' | 'TEACHER';
  status: 'ACTIVE' | 'INACTIVE' | 'REMOVED' | 'NOT_ACTIVED';
  bio: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  password: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  phone?: string;
  role?: 'ADMIN' | 'STUDENT' | 'TEACHER';
  status?: 'ACTIVE' | 'INACTIVE' | 'REMOVED' | 'NOT_ACTIVED';
  bio?: string;
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  phone?: string;
  role?: 'ADMIN' | 'STUDENT' | 'TEACHER';
  status?: 'ACTIVE' | 'INACTIVE' | 'REMOVED' | 'NOT_ACTIVED';
  bio?: string;
}

export interface UserQueryParams {
  search?: string;
  role?: 'ADMIN' | 'STUDENT' | 'TEACHER';
  status?: 'ACTIVE' | 'INACTIVE' | 'REMOVED' | 'NOT_ACTIVED';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  studentUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class UserService {
  async getAllUsers(params: UserQueryParams = {}): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get(API_BASE_URL, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post(API_BASE_URL, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put(`${API_BASE_URL}/${id}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/stats/overview`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  }
}

export const userService = new UserService();

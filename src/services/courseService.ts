import apiClient from './api';

const API_URL = '/dashboard/courses';

export interface Course {
  _id: string;
  name: string;
  description: string;
  price: number;
  instructorId?: string;
  instructor?: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  category?: string;
  categoryId?: string;
  cover?: string;
  icon?: string;
  students: string[];
  studentDetails?: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  }[];
  sessions: string[];
  duration: number;
  status: 'ACTIVE' | 'INACTIVE';
  averageRating: number;
  totalReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCourseData {
  name: string;
  description: string;
  price: number;
  instructorId?: string;
  category?: string;
  categoryId?: string;
  cover?: string;
  icon?: string;
  students?: string[];
  sessions?: string[];
  duration: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  price?: number;
  instructorId?: string;
  category?: string;
  categoryId?: string;
  cover?: string;
  icon?: string;
  students?: string[];
  sessions?: string[];
  duration?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CourseListResponse {
  success: boolean;
  message: string;
  data: Course[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  totalStudents: number;
  averagePrice: number;
}

export interface CourseStatsResponse {
  success: boolean;
  message: string;
  data: CourseStats;
}

export const courseService = {
  async getAllCourses(params: CourseQueryParams): Promise<CourseListResponse> {
    const response = await apiClient.get(API_URL, { params });
    return response.data;
  },

  async getCourseById(id: string): Promise<CourseResponse> {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  },

  async createCourse(courseData: CreateCourseData): Promise<CourseResponse> {
    const response = await apiClient.post(API_URL, courseData);
    return response.data;
  },

  async updateCourse(id: string, courseData: UpdateCourseData): Promise<CourseResponse> {
    const response = await apiClient.put(`${API_URL}/${id}`, courseData);
    return response.data;
  },

  async deleteCourse(id: string): Promise<CourseResponse> {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  },

  async getCourseStats(): Promise<CourseStatsResponse> {
    const response = await apiClient.get(`${API_URL}/stats`);
    return response.data;
  },

  async addStudentToCourse(courseId: string, studentId: string): Promise<CourseResponse> {
    const response = await apiClient.post(`${API_URL}/${courseId}/students`, { studentId });
    return response.data;
  },

  async removeStudentFromCourse(courseId: string, studentId: string): Promise<CourseResponse> {
    const response = await apiClient.delete(`${API_URL}/${courseId}/students/${studentId}`);
    return response.data;
  },

  async updateCourseInstructor(courseId: string, instructorId: string | null): Promise<CourseResponse> {
    const response = await apiClient.put(`${API_URL}/${courseId}/instructor`, { instructorId: instructorId || null });
    return response.data;
  },

  async removeCourseInstructor(courseId: string): Promise<CourseResponse> {
    const response = await apiClient.delete(`${API_URL}/${courseId}/instructor`);
    return response.data;
  },

  async getAvailableInstructors(): Promise<{ success: boolean; message: string; data: any[] }> {
    const response = await apiClient.get(`${API_URL}/available/instructors`);
    return response.data;
  },

  async getAvailableStudents(): Promise<{ success: boolean; message: string; data: any[] }> {
    const response = await apiClient.get(`${API_URL}/available/students`);
    return response.data;
  },

  async getCourseStudents(courseId: string): Promise<{ success: boolean; message: string; data: any[] }> {
    const response = await apiClient.get(`${API_URL}/${courseId}/students`);
    return response.data;
  },

  async getCourseInstructor(courseId: string): Promise<{ success: boolean; message: string; data: any }> {
    const response = await apiClient.get(`${API_URL}/${courseId}/instructor`);
    return response.data;
  },
};

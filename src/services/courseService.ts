import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/dashboard/courses`;

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
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(API_URL, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getCourseById(id: string): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async createCourse(courseData: CreateCourseData): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(API_URL, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async updateCourse(id: string, courseData: UpdateCourseData): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_URL}/${id}`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async deleteCourse(id: string): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getCourseStats(): Promise<CourseStatsResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async addStudentToCourse(courseId: string, studentId: string): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/${courseId}/students`, { studentId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async removeStudentFromCourse(courseId: string, studentId: string): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_URL}/${courseId}/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async updateCourseInstructor(courseId: string, instructorId: string | null): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_URL}/${courseId}/instructor`, { instructorId: instructorId || null }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async removeCourseInstructor(courseId: string): Promise<CourseResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_URL}/${courseId}/instructor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getAvailableInstructors(): Promise<{ success: boolean; message: string; data: any[] }> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/available/instructors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getAvailableStudents(): Promise<{ success: boolean; message: string; data: any[] }> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/available/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getCourseStudents(courseId: string): Promise<{ success: boolean; message: string; data: any[] }> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/${courseId}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getCourseInstructor(courseId: string): Promise<{ success: boolean; message: string; data: any }> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/${courseId}/instructor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

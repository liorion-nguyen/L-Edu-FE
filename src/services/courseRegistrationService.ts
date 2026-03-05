import apiClient from './api';

const API_URL = '/dashboard/course-registrations';

export interface CourseRegistration {
  _id: string;
  userId: string;
  courseId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message?: string;
  adminNote?: string;
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  course?: {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
  };
}

export interface CreateRegistrationData {
  courseId: string;
  message?: string;
}

export interface UpdateRegistrationData {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
}

export interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

class CourseRegistrationService {
  async createRegistration(data: CreateRegistrationData): Promise<CourseRegistration> {
    try {
      const response = await apiClient.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating course registration:', error);
      throw error;
    }
  }

  async getAllRegistrations(): Promise<CourseRegistration[]> {
    try {
      const response = await apiClient.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all registrations:', error);
      throw error;
    }
  }

  async getMyRegistrations(): Promise<CourseRegistration[]> {
    try {
      const response = await apiClient.get(`${API_URL}/my-registrations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching my registrations:', error);
      throw error;
    }
  }

  async getRegistrationsByStatus(status: string): Promise<CourseRegistration[]> {
    try {
      const response = await apiClient.get(`${API_URL}/by-status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching registrations by status:', error);
      throw error;
    }
  }

  async updateRegistrationStatus(
    registrationId: string,
    data: UpdateRegistrationData
  ): Promise<CourseRegistration> {
    try {
      const response = await apiClient.put(`${API_URL}/${registrationId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw error;
    }
  }

  async deleteRegistration(registrationId: string): Promise<void> {
    try {
      await apiClient.delete(`${API_URL}/${registrationId}`);
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }

  async getRegistrationStats(): Promise<RegistrationStats> {
    try {
      const response = await apiClient.get(`${API_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching registration stats:', error);
      throw error;
    }
  }
}

const courseRegistrationService = new CourseRegistrationService();
export default courseRegistrationService;

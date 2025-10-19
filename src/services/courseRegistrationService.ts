import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/dashboard/course-registrations`;

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
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createRegistration(data: CreateRegistrationData): Promise<CourseRegistration> {
    try {
      const response = await axios.post(API_URL, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating course registration:', error);
      throw error;
    }
  }

  async getAllRegistrations(): Promise<CourseRegistration[]> {
    try {
      const response = await axios.get(API_URL, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all registrations:', error);
      throw error;
    }
  }

  async getMyRegistrations(): Promise<CourseRegistration[]> {
    try {
      const response = await axios.get(`${API_URL}/my-registrations`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my registrations:', error);
      throw error;
    }
  }

  async getRegistrationsByStatus(status: string): Promise<CourseRegistration[]> {
    try {
      const response = await axios.get(`${API_URL}/by-status/${status}`, {
        headers: this.getAuthHeaders(),
      });
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
      const response = await axios.put(`${API_URL}/${registrationId}/status`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw error;
    }
  }

  async deleteRegistration(registrationId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${registrationId}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }

  async getRegistrationStats(): Promise<RegistrationStats> {
    try {
      const response = await axios.get(`${API_URL}/stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching registration stats:', error);
      throw error;
    }
  }
}

export default new CourseRegistrationService();

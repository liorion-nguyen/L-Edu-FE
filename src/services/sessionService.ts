import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/dashboard/sessions`;

export interface Session {
  _id: string;
  title: string;
  courseId: string;
  sessionNumber: string;
  views: number;
  description?: string;
  mode?: string;
  videoUrl?: {
    videoUrl?: string;
    mode?: string;
  };
  quizId?: {
    quizId?: string;
    mode?: string;
  };
  notesMd?: {
    notesMd?: any;
    mode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  title: string;
  courseId: string;
  sessionNumber: string;
  description?: string;
  mode?: string;
  videoUrl?: {
    videoUrl?: string;
    mode?: string;
  };
  quizId?: {
    quizId?: string;
    mode?: string;
  };
  notesMd?: {
    notesMd?: any;
    mode?: string;
  };
}

export interface UpdateSessionData {
  title?: string;
  courseId?: string;
  sessionNumber?: string;
  description?: string;
  mode?: string;
  videoUrl?: {
    videoUrl?: string;
    mode?: string;
  };
  quizId?: {
    quizId?: string;
    mode?: string;
  };
  notesMd?: {
    notesMd?: any;
    mode?: string;
  };
}

export interface SessionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
  instructorId?: string;
  type?: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
}

export interface SessionResponse {
  data: Session;
}

export interface SessionStatsResponse {
  totalSessions: number;
  publishedSessions: number;
  draftSessions: number;
  archivedSessions: number;
  totalViews: number;
  averageDuration: number;
  averageCompletionRate: number;
}

export interface UploadResponse {
  data: {
    url: string;
  };
}

class SessionService {
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

  async getSessions(params: SessionQueryParams = {}): Promise<SessionListResponse> {
    try {
      const response = await axios.get(API_URL, {
        headers: this.getAuthHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  async getSession(id: string): Promise<SessionResponse> {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  async createSession(data: CreateSessionData): Promise<SessionResponse> {
    try {
      // Add required fields - let backend handle sessionNumber conversion
      const payload = {
        ...data,
        description: data.description || "", // Add required description field
      };
      
      const response = await axios.post(API_URL, payload, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(id: string, data: UpdateSessionData): Promise<SessionResponse> {
    try {
      // Let backend handle sessionNumber conversion if provided
      const payload = {
        ...data,
        description: data.description || "", // Add required description field
      };
      
      const response = await axios.put(`${API_URL}/${id}`, payload, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async deleteSession(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  async getSessionStats(): Promise<SessionStatsResponse> {
    try {
      const response = await axios.get(`${API_URL}/stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching session stats:', error);
      throw error;
    }
  }

  async uploadThumbnail(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload/thumbnail`, formData, {
        headers: this.getFormDataHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  }

  async deleteThumbnail(url: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/delete/thumbnail`, {
        headers: this.getAuthHeaders(),
        data: { url },
      });
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      throw error;
    }
  }

  async getCourses(): Promise<{courses: Array<{_id: string, title: string}>}> {
    try {
      const response = await axios.get(`${API_URL}/courses`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();

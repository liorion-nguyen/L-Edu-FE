import apiClient from './api';

const API_URL = '/dashboard/sessions';

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
  async getSessions(params: SessionQueryParams = {}): Promise<SessionListResponse> {
    try {
      const response = await apiClient.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  async getSession(id: string): Promise<SessionResponse> {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  async createSession(data: CreateSessionData): Promise<SessionResponse> {
    try {
      const payload = { ...data, description: data.description || "" };
      const response = await apiClient.post(API_URL, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(id: string, data: UpdateSessionData): Promise<SessionResponse> {
    try {
      const payload = { ...data, description: data.description || "" };
      const response = await apiClient.put(`${API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async deleteSession(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  async getSessionStats(): Promise<SessionStatsResponse> {
    try {
      const response = await apiClient.get(`${API_URL}/stats`);
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
      const response = await apiClient.post(`${API_URL}/upload/thumbnail`, formData, {
        headers: { 'Content-Type': undefined as any },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  }

  async deleteThumbnail(url: string): Promise<void> {
    try {
      await apiClient.delete(`${API_URL}/delete/thumbnail`, { data: { url } });
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      throw error;
    }
  }

  async getCourses(): Promise<{ courses: Array<{ _id: string; title: string }> }> {
    try {
      const response = await apiClient.get(`${API_URL}/courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();

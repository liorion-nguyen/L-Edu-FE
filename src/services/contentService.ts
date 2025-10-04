import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/content`;

export interface ContentSection {
  title: string;
  description: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive?: boolean;
}

export interface Content {
  _id: string;
  page: string;
  section: string;
  title: string;
  subtitle: string;
  descriptions: string[];
  sections: ContentSection[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentListResponse {
  statusCode: number;
  message: string;
  data: Content[];
}

export interface ContentResponse {
  statusCode: number;
  message: string;
  data: Content | null;
}

export interface CreateContentData {
  page: string;
  section: string;
  title: string;
  subtitle: string;
  descriptions: string[];
  sections: ContentSection[];
  isActive?: boolean;
  order?: number;
}

export interface UpdateContentData {
  title?: string;
  subtitle?: string;
  descriptions?: string[];
  sections?: ContentSection[];
  isActive?: boolean;
  order?: number;
}

class ContentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getContents(): Promise<ContentListResponse> {
    const response = await axios.get(API_URL, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getContentByPage(page: string): Promise<ContentListResponse> {
    const response = await axios.get(`${API_URL}/page/${page}`);
    return response.data;
  }

  async getContentByPageAndSection(page: string, section: string): Promise<ContentResponse> {
    const response = await axios.get(`${API_URL}/page/${page}/section/${section}`);
    return response.data;
  }

  async createContent(data: CreateContentData): Promise<ContentResponse> {
    const response = await axios.post(API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateContent(id: string, data: UpdateContentData): Promise<ContentResponse> {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteContent(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

export const contentService = new ContentService();

import apiClient from './api';

const API_URL = '/content';

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
  async getContents(): Promise<ContentListResponse> {
    const response = await apiClient.get(API_URL);
    return response.data;
  }

  async getContentByPage(page: string): Promise<ContentListResponse> {
    const response = await apiClient.get(`${API_URL}/page/${page}`);
    return response.data;
  }

  async getContentByPageAndSection(page: string, section: string): Promise<ContentResponse> {
    const response = await apiClient.get(`${API_URL}/page/${page}/section/${section}`);
    return response.data;
  }

  async createContent(data: CreateContentData): Promise<ContentResponse> {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  }

  async updateContent(id: string, data: UpdateContentData): Promise<ContentResponse> {
    const response = await apiClient.patch(`${API_URL}/${id}`, data);
    return response.data;
  }

  async deleteContent(id: string): Promise<void> {
    await apiClient.delete(`${API_URL}/${id}`);
  }
}

export const contentService = new ContentService();

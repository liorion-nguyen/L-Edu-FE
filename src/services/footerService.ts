import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/footer`;

export interface FooterLink {
  label: string;
  url: string;
  isExternal: boolean;
  icon?: string;
  description?: string;
}

export interface Footer {
  _id: string;
  section: string;
  title: string;
  links: FooterLink[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFooterData {
  section: string;
  title: string;
  links: FooterLink[];
  isActive?: boolean;
  order?: number;
}

export interface UpdateFooterData {
  section?: string;
  title?: string;
  links?: FooterLink[];
  isActive?: boolean;
  order?: number;
}

export interface FooterResponse {
  success: boolean;
  message: string;
  data: Footer;
}

export interface FooterListResponse {
  success: boolean;
  message: string;
  data: Footer[];
}

class FooterService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getFooters(): Promise<FooterListResponse> {
    const response = await axios.get(API_URL);
    return response.data;
  }

  async getFootersAdmin(): Promise<FooterListResponse> {
    const response = await axios.get(`${API_URL}/admin`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getFooterById(id: string): Promise<FooterResponse> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async getFootersBySection(section: string): Promise<FooterListResponse> {
    const response = await axios.get(`${API_URL}/section/${section}`);
    return response.data;
  }

  async createFooter(data: CreateFooterData): Promise<FooterResponse> {
    const response = await axios.post(API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateFooter(id: string, data: UpdateFooterData): Promise<FooterResponse> {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteFooter(id: string): Promise<FooterResponse> {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const footerService = new FooterService();

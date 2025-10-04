import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/contact`;

export interface Contact {
  _id: string;
  type: string;
  label: string;
  value: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  type: string;
  label: string;
  value: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateContactData {
  type?: string;
  label?: string;
  value?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: Contact[];
}

class ContactService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getContacts(): Promise<ContactListResponse> {
    const response = await axios.get(API_URL);
    return response.data;
  }

  async getContactsAdmin(): Promise<ContactListResponse> {
    const response = await axios.get(`${API_URL}/admin`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getContactById(id: string): Promise<ContactResponse> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async getContactsByType(type: string): Promise<ContactListResponse> {
    const response = await axios.get(`${API_URL}/type/${type}`);
    return response.data;
  }

  async createContact(data: CreateContactData): Promise<ContactResponse> {
    const response = await axios.post(API_URL, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateContact(id: string, data: UpdateContactData): Promise<ContactResponse> {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteContact(id: string): Promise<ContactResponse> {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const contactService = new ContactService();



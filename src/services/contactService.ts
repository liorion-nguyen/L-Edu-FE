import apiClient from './api';

const API_URL = '/contact';

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
  async getContacts(): Promise<ContactListResponse> {
    const response = await apiClient.get(API_URL);
    return response.data;
  }

  async getContactsAdmin(): Promise<ContactListResponse> {
    const response = await apiClient.get(`${API_URL}/admin`);
    return response.data;
  }

  async getContactById(id: string): Promise<ContactResponse> {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  }

  async getContactsByType(type: string): Promise<ContactListResponse> {
    const response = await apiClient.get(`${API_URL}/type/${type}`);
    return response.data;
  }

  async createContact(data: CreateContactData): Promise<ContactResponse> {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  }

  async updateContact(id: string, data: UpdateContactData): Promise<ContactResponse> {
    const response = await apiClient.patch(`${API_URL}/${id}`, data);
    return response.data;
  }

  async deleteContact(id: string): Promise<ContactResponse> {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  }
}

export const contactService = new ContactService();



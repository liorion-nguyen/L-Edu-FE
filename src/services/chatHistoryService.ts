import axios from 'axios';
import { envConfig } from '../config';

const API_BASE_URL = envConfig.serverURL || 'http://localhost:5000';

export interface ChatHistoryItem {
  _id: string;
  userId: string;
  title: string;
  isActive: boolean;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    content: string;
    role: 'user' | 'assistant';
    createdAt: string;
    imageUrls?: string[];
  } | null;
  messageCount: number;
  status: 'active' | 'inactive';
}

export interface ChatHistoryResponse {
  success: boolean;
  data: ChatHistoryItem[];
  message?: string;
}

class ChatHistoryService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getConversationsHistory(): Promise<ChatHistoryResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chat/conversations-history`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching chat history:', error);
      throw new Error(
        error.response?.data?.message || 
        'Không thể tải lịch sử cuộc trò chuyện'
      );
    }
  }

  async getConversationMessages(conversationId: string) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversation messages:', error);
      throw new Error(
        error.response?.data?.message || 
        'Không thể tải tin nhắn cuộc trò chuyện'
      );
    }
  }

  async deleteConversation(conversationId: string) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      throw new Error(
        error.response?.data?.message || 
        'Không thể xóa cuộc trò chuyện'
      );
    }
  }
}

export const chatHistoryService = new ChatHistoryService();

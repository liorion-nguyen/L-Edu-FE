import axios from 'axios';
import { envConfig } from '../config';

const API_URL = `${envConfig.serverURL}/chat`;

export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface ChatConversation {
  _id: string;
  userId: string;
  title: string;
  isActive: boolean;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    content: string;
    role: 'user' | 'assistant';
    createdAt: string;
    imageUrls?: string[];
  };
  messageCount: number;
  status: 'active' | 'inactive';
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
  user?: User; // Thông tin user nếu role là 'user'
}

export interface ChatConversationWithMessages extends ChatConversation {
  messages: ChatMessage[];
}

class ChatManagementService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Lấy tất cả cuộc trò chuyện (admin only)
  async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const response = await axios.get(`${API_URL}/conversations-history?isAdmin=true`, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all conversations:', error);
      throw error;
    }
  }

  // Lấy chi tiết cuộc trò chuyện với tin nhắn
  async getConversationWithMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      console.log('Making API call to:', `${API_URL}/conversations/${conversationId}/messages`);
      
      const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`, {
        headers: this.getAuthHeaders(),
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      console.log('API Response data.data:', response.data.data);
      console.log('Is data.data an array?', Array.isArray(response.data.data));
      
      // Backend trả về { statusCode, message, data: [...messages] }
      const messages = response.data.data || [];
      console.log('Returning messages:', messages, 'Length:', messages.length);
      
      return messages;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      console.error('Error details:', (error as any).response?.data);
      throw error;
    }
  }

  // Xóa cuộc trò chuyện
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/conversations/${conversationId}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  // Xóa tin nhắn cụ thể
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/messages/${messageId}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Lấy thông tin user theo ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await axios.get(`${envConfig.serverURL}/dashboard/users/${userId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // Lấy thống kê chat
  async getChatStats(): Promise<{
    totalConversations: number;
    activeConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
  }> {
    try {
      const conversations = await this.getAllConversations();
      const totalConversations = conversations.length;
      const activeConversations = conversations.filter(c => c.isActive).length;
      const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);
      const averageMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0;

      return {
        totalConversations,
        activeConversations,
        totalMessages,
        averageMessagesPerConversation: Math.round(averageMessagesPerConversation * 100) / 100
      };
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  }
}

export const chatManagementService = new ChatManagementService();

import apiClient from './api';

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
  async getConversationsHistory(): Promise<ChatHistoryResponse> {
    try {
      const response = await apiClient.get('/chat/conversations-history');
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
      const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
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
      const response = await apiClient.delete(`/chat/conversations/${conversationId}/messages`);
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

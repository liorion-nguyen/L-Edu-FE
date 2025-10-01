import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { notification } from 'antd';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isComplete?: boolean;
}

interface UseChatbotReturn {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => Promise<void>;
  toggleChatbot: () => void;
  currentConversationId: string | null;
  createNewConversation: () => Promise<void>;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const CONVERSATION_KEY = 'chatbot_conversation_id';

const useChatbot = (): UseChatbotReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('jwt-access-token');
    
    if (!token) {
      console.error('❌ No JWT token found in localStorage');
      notification.error({
        message: 'Chưa đăng nhập',
        description: 'Vui lòng đăng nhập để sử dụng chatbot.',
      });
      return;
    }

    console.log('🔑 JWT Token found:', token.substring(0, 20) + '...');
    
    if (!socketRef.current) {
      console.log('🔌 Connecting to socket:', API_URL);
      
      socketRef.current = io(API_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected. Reason:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected us, probably auth error
          console.error('❌ Server disconnected - likely auth error');
        }
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
      });

      // Nhận tin nhắn user (từ server echo lại)
      socketRef.current.on('message', (message: any) => {
        console.log('📨 Received user message:', message);
      });

      // Nhận streaming response từ AI
      socketRef.current.on('streaming_message', (message: any) => {
        console.log('🤖 Streaming AI response:', message);
        
        setMessages(prev => {
          const existingIndex = prev.findIndex(msg => msg.id === message.id);
          
          if (existingIndex >= 0) {
            // Update existing message (streaming)
            const newMessages = [...prev];
            newMessages[existingIndex] = {
              id: message.id,
              content: message.content,
              role: 'assistant',
              timestamp: new Date(),
              isComplete: message.isComplete,
            };
            return newMessages;
          } else {
            // Add new AI message
            return [...prev, {
              id: message.id,
              content: message.content,
              role: 'assistant',
              timestamp: new Date(),
              isComplete: message.isComplete,
            }];
          }
        });
        
        // Tắt loading khi AI trả lời xong
        if (message.isComplete) {
          console.log('✅ AI response complete');
          setIsLoading(false);
        }
      });

      socketRef.current.on('error', (error: any) => {
        console.error('❌ Socket error:', error);
        const errorMsg = error.details || error.message || 'Không thể kết nối đến chatbot. Vui lòng thử lại.';
        notification.error({
          message: 'Lỗi chatbot',
          description: errorMsg,
          duration: 5,
        });
        setIsLoading(false);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Load conversation history khi có conversationId
  const loadConversationHistory = useCallback(async (conversationId: string) => {
    try {
      console.log('📖 Loading conversation history:', conversationId);
      const token = localStorage.getItem('jwt-access-token');
      const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Loaded history:', data.data.length, 'messages');
        
        const history = data.data.map((msg: any) => ({
          id: msg._id,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.createdAt),
          isComplete: true,
        }));
        
        setMessages(history);
      } else {
        console.error('❌ Failed to load history:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading conversation history:', error);
    }
  }, []);

  // Get or create user's conversation
  const getOrCreateConversation = useCallback(async () => {
    if (isInitializedRef.current) {
      console.log('⚠️ Already initialized');
      return;
    }

    try {
      console.log('📂 Getting user conversation...');
      const token = localStorage.getItem('jwt-access-token');
      
      // API sẽ tự động get hoặc tạo conversation cho user
      const response = await fetch(`${API_URL}/chat/my-conversation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const conversationId = data.data._id;
        
        console.log('✅ Got conversation:', conversationId);
        
        setCurrentConversationId(conversationId);
        localStorage.setItem(CONVERSATION_KEY, conversationId);
        isInitializedRef.current = true;
        
        // Join conversation room
        if (socketRef.current) {
          socketRef.current.emit('join_conversation', { conversationId });
          console.log('🔗 Joined conversation room:', conversationId);
        }

        // Load history
        await loadConversationHistory(conversationId);
      } else {
        console.error('❌ Failed to get conversation:', response.status);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải cuộc trò chuyện.',
        });
      }
    } catch (error) {
      console.error('❌ Error getting conversation:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể kết nối đến server.',
      });
    }
  }, [loadConversationHistory]);

  // Legacy method for compatibility
  const createNewConversation = getOrCreateConversation;

  // Load hoặc tạo conversation khi mở chatbot
  const initializeConversation = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    // Luôn lấy conversation từ server (theo userId)
    await getOrCreateConversation();
  }, [getOrCreateConversation]);

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) {
      console.log('⚠️ Empty message, skip');
      return;
    }

    // Ensure conversation exists
    if (!currentConversationId) {
      console.log('⚠️ No conversation, initializing...');
      await initializeConversation();
      // Retry after initialization
      setTimeout(() => {
        sendMessage(text);
      }, 500);
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      console.error('❌ Socket not connected');
      notification.error({
        message: 'Lỗi',
        description: 'Chưa kết nối đến server.',
      });
      return;
    }

    console.log('📤 Sending message:', text);
    setIsLoading(true);

    // 1. Hiển thị tin nhắn user ngay lập tức
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: text,
      role: 'user',
      timestamp: new Date(),
      isComplete: true,
    };
    setMessages(prev => [...prev, userMessage]);

    // 2. Gửi tin nhắn qua socket → Backend sẽ:
    //    - Lưu tin nhắn user vào DB
    //    - Gọi Gemini API
    //    - Stream response về qua socket event 'streaming_message'
    socketRef.current.emit('send_message', {
      conversationId: currentConversationId,
      content: text,
    });
    
    console.log('✅ Message sent via socket');
  }, [currentConversationId, initializeConversation]);

  const openChatbot = useCallback(() => {
    console.log('👋 Opening chatbot');
    setIsOpen(true);
    initializeConversation();
  }, [initializeConversation]);

  const closeChatbot = useCallback(() => {
    console.log('👋 Closing chatbot');
    setIsOpen(false);
  }, []);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      console.log(newState ? '👋 Opening chatbot' : '👋 Closing chatbot');
      if (newState) {
        initializeConversation();
      }
      return newState;
    });
  }, [initializeConversation]);

  const clearMessages = useCallback(async () => {
    console.log('🗑️ Clearing conversation');
    
    if (!currentConversationId) {
      console.log('⚠️ No conversation to clear');
      return;
    }

    try {
      const token = localStorage.getItem('jwt-access-token');
      
      // Gọi API để xóa conversation cũ và tạo mới
      const response = await fetch(`${API_URL}/chat/my-conversation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newConversationId = data.data.conversation._id;
        
        console.log('✅ Cleared conversation, new ID:', newConversationId);
        
        // Reset initialized flag để có thể load lại
        isInitializedRef.current = false;
        
        // Cập nhật state
        setCurrentConversationId(newConversationId);
        localStorage.setItem(CONVERSATION_KEY, newConversationId);
        setMessages([]);
        
        // Join room mới
        if (socketRef.current) {
          socketRef.current.emit('join_conversation', { conversationId: newConversationId });
        }
        
        notification.success({
          message: 'Thành công',
          description: 'Đã tạo cuộc trò chuyện mới',
        });
      } else {
        throw new Error('Failed to clear conversation');
      }
    } catch (error) {
      console.error('❌ Error clearing conversation:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể xóa cuộc trò chuyện',
      });
    }
  }, [currentConversationId]);

  return {
    isOpen,
    messages,
    isLoading,
    openChatbot,
    closeChatbot,
    sendMessage,
    clearMessages,
    toggleChatbot,
    currentConversationId,
    createNewConversation,
  };
};

export default useChatbot;
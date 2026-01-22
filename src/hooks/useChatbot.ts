import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { notification } from 'antd';
import { getStoredTokens, refreshAccessToken, isTokenExpired } from '../utils/tokenUtils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isComplete?: boolean;
  imageUrls?: string[];
}

interface UseChatbotReturn {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  sendMessage: (text: string, imageUrls?: string[]) => Promise<void>;
  clearMessages: () => Promise<void>;
  toggleChatbot: () => void;
  currentConversationId: string | null;
  createNewConversation: () => Promise<void>;
  loadConversationHistory: (conversationId: string) => Promise<void>;
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
  const listenersRegisteredRef = useRef(false);

  // Initialize socket connection only when needed
  const initializeSocketConnection = useCallback(() => {
    const tokens = getStoredTokens();
    
    if (!tokens) {
      console.error('❌ No JWT token found in localStorage');
      notification.error({
        message: 'Chưa đăng nhập',
        description: 'Vui lòng đăng nhập để sử dụng chatbot.',
      });
      return false;
    }

    // Check if token is expired and try to refresh
    if (isTokenExpired()) {
      console.log('🔄 Token expired, attempting refresh...');
      refreshAccessToken().then((result) => {
        if (result) {
          console.log('✅ Token refreshed successfully');
          initializeSocket(result.access_token);
        } else {
          console.error('❌ Token refresh failed');
          notification.error({
            message: 'Phiên đăng nhập hết hạn',
            description: 'Vui lòng đăng nhập lại.',
          });
        }
      });
      return false;
    }

    console.log('🔑 JWT Token found:', tokens.accessToken.substring(0, 20) + '...');
    initializeSocket(tokens.accessToken);
    return true;
  }, []);

  // Helper function to ensure socket connection
  const ensureSocketConnection = useCallback(() => {
    if (!socketRef.current || !socketRef.current.connected || !(socketRef.current as any).isReady) {
      console.log('🔄 Ensuring socket connection...');
      return initializeSocketConnection();
    }
    return true;
  }, [initializeSocketConnection]);

  const initializeSocket = (token: string) => {
    if (!socketRef.current) {
      console.log('🔌 Connecting to socket:', API_URL);
      
      socketRef.current = io(API_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

      // Đăng ký tất cả listeners trước khi connect (chỉ một lần)
      if (!listenersRegisteredRef.current) {
        console.log('🔗 Registering socket listeners...');
        listenersRegisteredRef.current = true;

        // Debug: Log tất cả events
        socketRef.current.onAny((eventName, ...args) => {
          console.log('🔍 Socket event received:', eventName, args);
        });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected:', socketRef.current?.id);
        // Set a flag to indicate connection is ready
        if (socketRef.current) {
          (socketRef.current as any).isReady = true;
        }
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected. Reason:', reason);
        // Clear ready flag on disconnect
        if (socketRef.current) {
          (socketRef.current as any).isReady = false;
        }
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
        console.log('📨 Received streaming_message event:', message);
        console.log('📨 Message ID:', message.id, 'isComplete:', message.isComplete);
        // Log streaming progress
        if (message.isComplete) {
          console.log('✅ AI response complete. Length:', message.content.length);
          console.log('🔄 Setting isLoading to false');
        } else {
          console.log('📡 Streaming... Length:', message.content.length);
        }
        
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
            // Add new AI message (first chunk)
            console.log('🆕 First chunk received, creating message');
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
          setIsLoading(false);
          console.log('✅ Loading state set to false');
          // Clear any pending timeout
          if ((window as any).currentLoadingTimeout) {
            clearTimeout((window as any).currentLoadingTimeout);
            (window as any).currentLoadingTimeout = null;
          }
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

      // Handle token expiration
      socketRef.current.on('token_expired', async (data: any) => {
        console.log('🔄 Token expired, attempting refresh...', data);
        
        try {
          const refreshToken = localStorage.getItem('jwt-refresh-token');
          if (!refreshToken) {
            console.error('❌ No refresh token available');
            notification.error({
              message: 'Phiên đăng nhập hết hạn',
              description: 'Vui lòng đăng nhập lại.',
              duration: 5,
            });
            return;
          }

          // Request token refresh from server
          socketRef.current?.emit('refresh_token', { refresh_token: refreshToken });
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          notification.error({
            message: 'Không thể làm mới token',
            description: 'Vui lòng đăng nhập lại.',
            duration: 5,
          });
        }
      });

      // Handle successful token refresh
      socketRef.current.on('token_refreshed', (data: any) => {
        console.log('✅ Token refreshed successfully');
        
        // Update stored access token
        localStorage.setItem('jwt-access-token', data.access_token);
        
        notification.success({
          message: 'Token đã được làm mới',
          description: 'Kết nối chatbot đã được khôi phục.',
          duration: 3,
        });
      });

      // Handle token refresh errors
      socketRef.current.on('refresh_error', (error: any) => {
        console.error('❌ Token refresh failed:', error);
        notification.error({
          message: 'Không thể làm mới token',
          description: error.message || 'Vui lòng đăng nhập lại.',
          duration: 5,
        });
      });
      }
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Load conversation history by ID
  const loadConversationHistoryById = useCallback(async (conversationId: string) => {
    try {
      console.log('📂 Loading conversation history for:', conversationId);
      const tokens = getStoredTokens();
      console.log('🔑 Token available:', !!tokens?.accessToken, tokens?.accessToken ? tokens.accessToken.substring(0, 20) + '...' : 'No token');
      
      const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        const messages = data.data.map((msg: any) => ({
          id: msg._id,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.createdAt),
          isComplete: msg.isComplete,
          imageUrls: msg.imageUrls || [],
        }));
        
        console.log('✅ Loaded', messages.length, 'messages');
        setMessages(messages);
        setCurrentConversationId(conversationId);
        
        // Join conversation room
        if (socketRef.current) {
          socketRef.current.emit('join_conversation', { conversationId });
          console.log('🔗 Joined conversation room:', conversationId);
          console.log('🔗 Socket ID:', socketRef.current.id);
        }
      } else {
        console.error('❌ Failed to load history:', response.status, await response.text());
      }
    } catch (error) {
      console.error('❌ Error loading conversation history:', error);
    }
  }, []);

  // Load conversation history khi có conversationId
  const loadConversationHistory = useCallback(async (conversationId: string) => {
    try {
      console.log('📖 Loading conversation history:', conversationId);
      const tokens = getStoredTokens();
      const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
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
          imageUrls: msg.imageUrls || [],
        }));
        
        // Log nếu có attachments
        const messagesWithImages = history.filter((m: Message) => m.imageUrls && m.imageUrls.length > 0);
        if (messagesWithImages.length > 0) {
          console.log('📷 Found', messagesWithImages.length, 'messages with images');
        }
        
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
      
      // API sẽ tự động get hoặc tạo conversation cho user
      const tokens = getStoredTokens();
      const response = await fetch(`${API_URL}/chat/my-conversation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
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
          console.log('🔗 Socket ID:', socketRef.current.id);
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
  const sendMessage = useCallback(async (text: string, imageUrls?: string[]) => {
    if (!text.trim() && (!imageUrls || imageUrls.length === 0)) {
      console.log('⚠️ Empty message, skip');
      return;
    }

    // Ensure conversation exists
    if (!currentConversationId) {
      console.log('⚠️ No conversation, initializing...');
      await initializeConversation();
      // Retry after initialization
      setTimeout(() => {
        sendMessage(text, imageUrls);
      }, 500);
      return;
    }

    // Ensure socket is connected before sending message
    if (!ensureSocketConnection()) {
      notification.error({
        message: 'Lỗi kết nối',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
      });
      return;
    }
    
    // Double check socket connection and readiness
    if (!socketRef.current || !socketRef.current.connected || !(socketRef.current as any).isReady) {
      console.log('🔄 Socket still not ready, retrying in 1 second...');
      setTimeout(() => {
        if (socketRef.current && socketRef.current.connected && (socketRef.current as any).isReady) {
          sendMessage(text, imageUrls);
        } else {
          notification.error({
            message: 'Lỗi kết nối',
            description: 'Không thể kết nối đến server. Vui lòng thử lại.',
          });
        }
      }, 1000);
      return;
    }

    console.log('📤 Sending message:', text);
    if (imageUrls && imageUrls.length > 0) {
      console.log('   With images:', imageUrls.length);
    }
    setIsLoading(true);
    
    // Fallback timeout để tắt loading sau 30 giây
    const loadingTimeout = setTimeout(() => {
      console.log('⏰ Loading timeout - forcing isLoading to false');
      setIsLoading(false);
    }, 30000);
    
    // Store timeout reference để có thể clear sau này
    (window as any).currentLoadingTimeout = loadingTimeout;

    // 1. Hiển thị tin nhắn user ngay lập tức
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: text,
      role: 'user',
      timestamp: new Date(),
      isComplete: true,
      imageUrls: imageUrls || [],
    };
    setMessages(prev => [...prev, userMessage]);

    // 2. Đảm bảo join room trước khi gửi message
    console.log('🔗 Ensuring client is in conversation room:', currentConversationId);
    socketRef.current.emit('join_conversation', { conversationId: currentConversationId });
    
    // 3. Gửi tin nhắn qua socket → Backend sẽ:
    //    - Lưu tin nhắn user vào DB
    //    - Gọi Gemini API (với ảnh nếu có)
    //    - Stream response về qua socket event 'streaming_message'
    socketRef.current.emit('send_message', {
      conversationId: currentConversationId,
      content: text,
      imageUrls: imageUrls || [],
    });
    
    console.log('✅ Message sent via socket');
  }, [currentConversationId, initializeConversation, ensureSocketConnection]);

  const openChatbot = useCallback(() => {
    console.log('👋 Opening chatbot');
    if (initializeSocketConnection()) {
      setIsOpen(true);
      // Wait for socket to connect before initializing conversation
      setTimeout(() => {
        if (socketRef.current && socketRef.current.connected && (socketRef.current as any).isReady) {
          initializeConversation();
        } else {
          console.log('⚠️ Socket not ready yet, retrying...');
          setTimeout(() => {
            if (socketRef.current && socketRef.current.connected && (socketRef.current as any).isReady) {
              initializeConversation();
            }
          }, 1000);
        }
      }, 500);
    }
  }, [initializeConversation, initializeSocketConnection]);

  const closeChatbot = useCallback(() => {
    console.log('👋 Closing chatbot');
    setIsOpen(false);
  }, []);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      console.log(newState ? '👋 Opening chatbot' : '👋 Closing chatbot');
      if (newState) {
        if (initializeSocketConnection()) {
          // Wait for socket to connect before initializing conversation
          setTimeout(() => {
            if (socketRef.current && socketRef.current.connected && (socketRef.current as any).isReady) {
              initializeConversation();
            } else {
              console.log('⚠️ Socket not ready yet, retrying...');
              setTimeout(() => {
                if (socketRef.current && socketRef.current.connected && (socketRef.current as any).isReady) {
                  initializeConversation();
                }
              }, 1000);
            }
          }, 500);
        } else {
          return prev; // Don't open if initialization failed
        }
      }
      return newState;
    });
  }, [initializeConversation, initializeSocketConnection]);

  const clearMessages = useCallback(async () => {
    console.log('🗑️ Clearing conversation');
    
    if (!currentConversationId) {
      console.log('⚠️ No conversation to clear');
      return;
    }

    try {
      // Gọi API để xóa conversation cũ và tạo mới
      const tokens = getStoredTokens();
      const response = await fetch(`${API_URL}/chat/my-conversation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
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
          description: 'Đã xóa cuộc trò chuyện và tạo mới',
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
    loadConversationHistory: loadConversationHistoryById,
  };
};

export default useChatbot;
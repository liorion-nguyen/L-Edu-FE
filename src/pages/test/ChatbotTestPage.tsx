import React, { useEffect } from 'react';
import { Card, Button, Space, Typography, Divider } from 'antd';
import useChatbot from '../../hooks/useChatbot';
import ChatPopup from '../../components/chatbot/ChatPopup';

const { Title, Text } = Typography;

const ChatbotTestPage: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    currentConversationId,
    sendMessage,
    createNewConversation,
    clearMessages,
    toggleChatbot,
  } = useChatbot();

  useEffect(() => {
    console.log('Current conversation ID:', currentConversationId);
    console.log('Messages:', messages);
  }, [currentConversationId, messages]);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>Chatbot Test Page</Title>
        
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>Current Conversation ID: </Text>
            <Text code>{currentConversationId || 'None'}</Text>
          </div>

          <div>
            <Text strong>Total Messages: </Text>
            <Text>{messages.length}</Text>
          </div>

          <div>
            <Text strong>Is Loading: </Text>
            <Text>{isLoading ? 'Yes' : 'No'}</Text>
          </div>

          <Divider />

          <Space>
            <Button type="primary" onClick={createNewConversation}>
              Tạo Conversation Mới
            </Button>
            <Button onClick={clearMessages}>
              Xóa Tin Nhắn
            </Button>
            <Button onClick={toggleChatbot}>
              Toggle Chatbot
            </Button>
            <Button 
              onClick={() => sendMessage('Xin chào!')}
              disabled={!currentConversationId}
            >
              Gửi Test Message
            </Button>
          </Space>

          <Divider />

          <div>
            <Title level={4}>Messages History:</Title>
            <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #f0f0f0', padding: '16px', borderRadius: '8px' }}>
              {messages.length === 0 ? (
                <Text type="secondary">Chưa có tin nhắn nào</Text>
              ) : (
                messages.map((msg, index) => (
                  <div key={msg.id} style={{ marginBottom: '12px', padding: '8px', background: msg.role === 'user' ? '#e6f7ff' : '#f5f5f5', borderRadius: '4px' }}>
                    <Text strong>{msg.role === 'user' ? 'User' : 'AI'}: </Text>
                    <Text>{msg.content}</Text>
                    {msg.role === 'assistant' && !msg.isComplete && (
                      <Text type="secondary"> (đang nhập...)</Text>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Space>
      </Card>

      <ChatPopup
        visible={true}
        onClose={() => {}}
        messages={messages}
        onSendMessage={sendMessage}
        onClearMessages={clearMessages}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatbotTestPage;

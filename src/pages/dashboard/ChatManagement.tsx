import React, { useState } from 'react';
import { Card, Tabs, Modal } from 'antd';
import { HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import ChatHistory from '../../components/chatbot/ChatHistory';
import ChatPopup from '../../components/chatbot/ChatPopup';
import ChatContentManagement from '../../components/admin/ChatContentManagement';
import useChatbot from '../../hooks/useChatbot';

const ChatManagement: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    loadConversationHistory
  } = useChatbot();

  const handleViewConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setChatModalVisible(true);
    
    // Load conversation history
    try {
      console.log('Loading conversation:', conversationId);
      await loadConversationHistory(conversationId);
      console.log('Conversation loaded successfully');
    } catch (error) {
      console.error('Error loading conversation:', error);
      // Có thể thêm notification error ở đây
    }
  };

  const handleCloseChatModal = () => {
    setChatModalVisible(false);
    setSelectedConversationId(null);
    // Không clear messages ở đây để tránh alert sai
  };

  const handleClearMessages = async () => {
    try {
      await clearMessages();
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  const tabItems = [
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          Lịch sử cuộc trò chuyện
        </span>
      ),
      children: (
        <ChatHistory onViewConversation={handleViewConversation} />
      ),
    },
    {
      key: 'content-management',
      label: (
        <span>
          <SettingOutlined />
          Quản lý nội dung
        </span>
      ),
      children: (
        <ChatContentManagement />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Quản lý Chatbot" style={{ marginBottom: '24px' }}>
        <Tabs defaultActiveKey="history" items={tabItems} />
      </Card>

      <Modal
        title={`Cuộc trò chuyện ${selectedConversationId ? `#${selectedConversationId.substring(0, 8)}` : ''}`}
        open={chatModalVisible}
        onCancel={handleCloseChatModal}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ height: '600px' }}>
          <ChatPopup
            visible={true}
            onClose={handleCloseChatModal}
            messages={messages}
            onSendMessage={sendMessage}
            onClearMessages={handleClearMessages}
            isLoading={isLoading}
            showHeader={false}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChatManagement;
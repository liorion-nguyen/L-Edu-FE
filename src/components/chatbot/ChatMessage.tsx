import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div style={isUser ? styles.userMessage : styles.botMessage}>
      <div style={styles.messageContent}>
        <div style={styles.avatarContainer}>
          <Avatar
            size={32}
            icon={isUser ? <UserOutlined /> : <RobotOutlined />}
            style={isUser ? styles.userAvatar : styles.botAvatar}
          />
        </div>
        <div style={styles.messageBubble}>
          <div style={styles.messageText}>
            {message.text}
          </div>
          <div style={styles.timestamp}>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {message.timestamp.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  userMessage: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '12px',
  },
  botMessage: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '12px',
  },
  messageContent: {
    display: 'flex',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  avatarContainer: {
    margin: '0 8px',
  },
  userAvatar: {
    backgroundColor: '#1890ff',
  },
  botAvatar: {
    backgroundColor: '#52c41a',
  },
  messageBubble: {
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    padding: '8px 12px',
    position: 'relative',
    maxWidth: '100%',
    wordWrap: 'break-word',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#333',
    marginBottom: '4px',
  },
  timestamp: {
    textAlign: 'right',
  },
};

export default ChatMessage;

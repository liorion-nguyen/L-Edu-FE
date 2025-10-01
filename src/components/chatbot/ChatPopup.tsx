import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Empty, Button, Popconfirm } from 'antd';
import { SendOutlined, CloseOutlined, RobotOutlined, DeleteOutlined } from '@ant-design/icons';
import MarkdownViewer from '../common/MarkdownViewer';
import './chatbot.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isComplete?: boolean;
}

interface ChatPopupProps {
  visible: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onClearMessages: () => Promise<void>;
  isLoading: boolean;
}

const ChatPopup: React.FC<ChatPopupProps> = ({
  visible,
  onClose,
  messages,
  onSendMessage,
  onClearMessages,
  isLoading,
}) => {
  const [inputText, setInputText] = React.useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Adjust position for mobile
        if (inputRef.current) {
          inputRef.current.style.width = '180px';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!visible) return null;

  const handleSend = async () => {
    if (inputText.trim()) {
      await onSendMessage(inputText.trim());
      setInputText('');
      // Không đóng expanded state sau khi gửi
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift + Enter để xuống dòng
    if (e.shiftKey && e.key === 'Enter') {
      return; // Cho phép xuống dòng
    }
    // Enter để gửi tin nhắn
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.chat-input') && !target.closest('.chat-card')) {
      setIsExpanded(false);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    onClose();
  };

  return (
    <div className={`chat-popup ${isExpanded ? 'expanded' : ''}`} onClick={handleClickOutside}>
      {isExpanded && (
        <Card
          title={
            <div className="chat-header">
              <RobotOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              AI Assistant
            </div>
          }
          extra={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Popconfirm
                title="Xóa cuộc trò chuyện?"
                description="Bạn có chắc muốn xóa toàn bộ lịch sử chat?"
                onConfirm={onClearMessages}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  danger
                  title="Xóa cuộc trò chuyện"
                />
              </Popconfirm>
              <Button type="text" icon={<CloseOutlined />} onClick={handleClose} />
            </div>
          }
          className="chat-card"
        >
          <div className="chat-messages">
            {messages.length === 0 ? (
              <Empty
                description="Chưa có tin nhắn nào"
                style={{ margin: '20px 0' }}
              />
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="markdown-content">
                      <MarkdownViewer 
                        content={msg.content} 
                        className="chatbot-markdown"
                      />
                      {!msg.isComplete && (
                        <span className="typing-indicator">...</span>
                      )}
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="message bot">
                <span className="typing-indicator">AI đang trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>
      )}
      
      <div className={`chat-input ${isExpanded ? 'expanded' : ''}`}>
        <div className="input-wrapper">
          <Input.TextArea
            ref={inputRef}
            placeholder={isExpanded ? "Nhập tin nhắn... (Shift+Enter để xuống dòng)" : "Chat với AI Assistant (Ctrl+Enter để mở rộng)"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={isLoading}
          />
          <SendOutlined
            onClick={handleSend}
            className="send-icon"
            style={{ 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              color: isLoading ? '#ccc' : '#1890ff',
              fontSize: isExpanded ? 16 : 14
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
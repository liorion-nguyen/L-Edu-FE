import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Empty, Button, Popconfirm, Upload, Image, message as antMessage } from 'antd';
import { SendOutlined, CloseOutlined, RobotOutlined, DeleteOutlined, PictureOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import MarkdownViewer from '../common/MarkdownViewer';
import './chatbot.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isComplete?: boolean;
  imageUrls?: string[];
}

interface ChatPopupProps {
  visible: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text: string, imageUrls?: string[]) => Promise<void>;
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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const inputRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }, 100);
  };

  // Auto-scroll khi có messages mới
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages]);

  // Scroll khi mở chat box
  useEffect(() => {
    if (isExpanded && messages.length > 0) {
      scrollToBottom(false); // Scroll ngay lập tức khi mở
    }
  }, [isExpanded]);

  // Scroll khi AI đang streaming
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      scrollToBottom(true);
    }
  }, [isLoading]);

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
    if (inputText.trim() || uploadedImages.length > 0) {
      await onSendMessage(inputText.trim(), uploadedImages);
      setInputText('');
      setUploadedImages([]);
      // Scroll xuống cuối sau khi gửi
      setTimeout(() => scrollToBottom(true), 200);
      // Không đóng expanded state sau khi gửi
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      antMessage.loading({ content: 'Đang upload ảnh...', key: 'upload' });
      
      // Upload to Cloudinary via backend
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('jwt-access-token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/chat/upload-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data.url;
        
        setUploadedImages(prev => [...prev, imageUrl]);
        antMessage.success({ content: 'Đã thêm ảnh', key: 'upload' });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      antMessage.error({ content: 'Lỗi khi upload ảnh', key: 'upload' });
    }
    
    return false; // Prevent auto upload
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
                  className={`message ${msg.role === 'user' ? 'user' : 'bot'} ${msg.isComplete ? 'complete' : 'streaming'}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="markdown-content">
                      <MarkdownViewer 
                        content={msg.content} 
                        className="chatbot-markdown"
                      />
                      {!msg.isComplete && (
                        <span className="typing-indicator">đang nhập</span>
                      )}
                    </div>
                  ) : (
                    <div>
                      {msg.imageUrls && msg.imageUrls.length > 0 && (
                        <div className="message-images">
                          {msg.imageUrls.map((url, idx) => (
                            <Image
                              key={idx}
                              src={url}
                              alt={`Image ${idx + 1}`}
                              style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '8px' }}
                              preview={{
                                mask: '🔍 Xem lớn'
                              }}
                            />
                          ))}
                        </div>
                      )}
                      
                      <span>{msg.content}</span>
                    </div>
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
        {/* Preview uploaded images */}
        {uploadedImages.length > 0 && (
          <div className="attachments-preview-container">
            {uploadedImages.map((url, index) => (
              <div key={`img-${index}`} className="image-preview">
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <CloseCircleOutlined 
                  className="remove-attachment-btn"
                  onClick={() => removeImage(index)}
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="input-wrapper">
          <div style={{ display: isExpanded ? 'flex' : 'none', gap: '4px' }}>
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
              disabled={isLoading}
            >
              <Button 
                type="text" 
                icon={<PictureOutlined />}
                disabled={isLoading}
                style={{ color: '#1890ff' }}
                title="Thêm ảnh"
              />
            </Upload>
          </div>
          
          <Input.TextArea
            ref={inputRef}
            placeholder={isExpanded ? "Nhập tin nhắn... (Shift+Enter để xuống dòng)" : "Chat với AI Assistant"}
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
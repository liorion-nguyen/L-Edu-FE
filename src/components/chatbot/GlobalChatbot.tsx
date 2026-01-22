import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatPopup from './ChatPopup';
import useChatbot from '../../hooks/useChatbot';

const GlobalChatbot: React.FC = () => {
  const location = useLocation();
  const { 
    messages, 
    isLoading,
    closeChatbot, 
    sendMessage,
    clearMessages,
    createNewConversation 
  } = useChatbot();
  
  // Show chatbot only on course-related pages
  const shouldShowChatbot = location.pathname.includes('/course');
  
  // Auto-load conversation khi vào trang course
  useEffect(() => {
    if (shouldShowChatbot) {
      console.log('📂 Auto-loading conversation on course page');
      createNewConversation();
    }
  }, [shouldShowChatbot, createNewConversation]);
  
  if (!shouldShowChatbot) {
    return null;
  }

  return (
    <ChatPopup 
      visible={true}
      onClose={closeChatbot}
      messages={messages}
      onSendMessage={sendMessage}
      onClearMessages={clearMessages}
      isLoading={isLoading}
    />
  );
};

export default GlobalChatbot;

# 🤖 Chatbot AI Integration

## 📋 Overview

Tính năng chatbot AI đã được tích hợp vào trang courses với giao diện hiện đại và trải nghiệm người dùng mượt mà.

## 🎯 Features

### ✅ Completed Features

1. **ChatbotIcon Component**
   - Icon chatbot ở góc phải màn hình
   - Animation pulse khi đóng
   - Animation scale khi mở
   - Responsive design

2. **ChatbotModal Component**
   - Modal chat với giao diện đẹp
   - Auto-scroll to bottom
   - Loading state khi AI đang trả lời
   - Empty state khi chưa có tin nhắn

3. **ChatMessage Component**
   - Hiển thị tin nhắn user và bot
   - Avatar khác nhau cho user/bot
   - Timestamp cho mỗi tin nhắn
   - Bubble design với màu sắc phân biệt

4. **ChatInput Component**
   - Input textarea với auto-resize
   - Send button với icon
   - Enter để gửi tin nhắn
   - Disabled state khi đang loading

5. **useChatbot Hook**
   - State management cho chatbot
   - Send message function
   - Loading state management
   - Error handling

6. **Integration với Courses Page**
   - Chatbot chỉ hiện ở trang courses
   - Toggle open/close
   - Responsive design

## 🎨 UI/UX Features

- **Modern Design**: Giao diện hiện đại với Ant Design
- **Smooth Animations**: Animation mượt mà cho các interactions
- **Responsive**: Hoạt động tốt trên mobile và desktop
- **Accessibility**: Tooltip và keyboard navigation
- **Loading States**: Visual feedback khi AI đang xử lý

## 🔧 Technical Implementation

### Components Structure
```
src/components/chatbot/
├── ChatbotIcon.tsx      # Icon button ở góc màn hình
├── ChatbotModal.tsx      # Modal chứa chat interface
├── ChatMessage.tsx       # Component hiển thị tin nhắn
├── ChatInput.tsx         # Component input tin nhắn
└── chatbot.css          # CSS animations và styles

src/hooks/
└── useChatbot.ts        # Custom hook quản lý state
```

### State Management
- `isOpen`: Trạng thái mở/đóng modal
- `messages`: Array các tin nhắn
- `isLoading`: Trạng thái loading khi AI đang trả lời

### AI Response Logic
Hiện tại sử dụng simple rule-based responses cho các chủ đề:
- Khóa học
- Giá cả
- Hỗ trợ
- Lời chào
- Cảm ơn

## 🚀 Usage

### Basic Usage
```tsx
import ChatbotIcon from '../components/chatbot/ChatbotIcon';
import ChatbotModal from '../components/chatbot/ChatbotModal';
import useChatbot from '../hooks/useChatbot';

const MyComponent = () => {
  const { isOpen, openChatbot, closeChatbot } = useChatbot();
  
  return (
    <>
      <ChatbotIcon 
        onClick={isOpen ? closeChatbot : openChatbot}
        isOpen={isOpen}
      />
      <ChatbotModal 
        visible={isOpen}
        onClose={closeChatbot}
      />
    </>
  );
};
```

### Custom Hook Usage
```tsx
const {
  isOpen,           // boolean - modal state
  messages,         // Message[] - chat messages
  isLoading,       // boolean - loading state
  openChatbot,     // () => void - open modal
  closeChatbot,    // () => void - close modal
  sendMessage,     // (text: string) => Promise<void>
  clearMessages,   // () => void - reset messages
} = useChatbot();
```

## 🔮 Future Enhancements

### Phase 2: Backend Integration
- [ ] API endpoint cho chatbot
- [ ] Real AI integration (OpenAI, Claude, etc.)
- [ ] Message persistence
- [ ] User context awareness

### Phase 3: Advanced Features
- [ ] File upload support
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Chat history
- [ ] Export chat

### Phase 4: Analytics
- [ ] Chat analytics
- [ ] User engagement metrics
- [ ] Response time tracking
- [ ] Popular questions analysis

## 🎯 Current Status

✅ **Phase 1 Complete**: UI/UX Implementation
- All components created and integrated
- Responsive design implemented
- Animations and interactions working
- State management functional

🔄 **Next Phase**: Backend Integration
- API development needed
- Real AI integration required
- Database schema for messages

## 📱 Responsive Design

- **Desktop**: Full-size modal (400px width)
- **Tablet**: Responsive modal (90% width, max 400px)
- **Mobile**: Optimized layout with smaller icon

## 🎨 Styling

- **Primary Color**: #1890ff (Ant Design Blue)
- **Success Color**: #52c41a (Green for bot)
- **Background**: #fafafa (Light gray)
- **Text**: #333 (Dark gray)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Icon appears in bottom-right corner
- [ ] Click icon opens modal
- [ ] Modal displays welcome message
- [ ] Send message works
- [ ] AI responds appropriately
- [ ] Loading state shows during response
- [ ] Modal closes properly
- [ ] Responsive on mobile
- [ ] Animations work smoothly

### Test Cases
1. **Basic Chat Flow**: Send message → Receive response
2. **Loading State**: Verify loading indicator
3. **Error Handling**: Test with invalid input
4. **Responsive**: Test on different screen sizes
5. **Accessibility**: Test keyboard navigation

## 📝 Notes

- Chatbot chỉ hiện ở trang courses
- Messages không được persist (sẽ reset khi reload)
- AI responses hiện tại là rule-based
- Cần backend integration để có AI thực sự
- CSS animations được optimize cho performance

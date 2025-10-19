# Tính năng Lịch sử Chatbot

## Tổng quan
Tính năng này cho phép người dùng xem và quản lý lịch sử các cuộc trò chuyện với chatbot AI.

## Các thành phần đã được tạo

### Backend (L-Edu-BE)

#### 1. API Endpoint mới
- **GET** `/chat/conversations-history` - Lấy danh sách conversation với thông tin chi tiết

#### 2. Service methods
- `getConversationsWithDetails(userId: string)` - Lấy danh sách conversation với:
  - Tin nhắn cuối cùng
  - Số lượng tin nhắn
  - Trạng thái hoạt động
  - Thời gian hoạt động cuối

### Frontend (L-Edu-FE)

#### 1. Service
- `chatHistoryService.ts` - Service để gọi API lịch sử chatbot

#### 2. Components
- `ChatHistory.tsx` - Component hiển thị bảng lịch sử conversation
- `ChatManagement.tsx` - Trang dashboard quản lý chatbot

#### 3. Hooks
- Cập nhật `useChatbot.ts` với function `loadConversationHistory`

## Cách sử dụng

### 1. Truy cập trang quản lý chatbot
- Đăng nhập với tài khoản admin/user
- Truy cập `/dashboard/chat`

### 2. Xem lịch sử conversation
Bảng hiển thị các thông tin:
- **Người dùng**: ID người dùng (rút gọn)
- **Tin nhắn cuối**: Nội dung tin nhắn cuối cùng và người gửi
- **Số tin nhắn**: Tổng số tin nhắn trong conversation
- **Trạng thái**: Hoạt động/Không hoạt động
- **Hoạt động cuối**: Thời gian tin nhắn cuối (tương đối)

### 3. Các hành động có thể thực hiện
- **Xem**: Mở conversation trong modal để xem chi tiết
- **Xóa**: Xóa toàn bộ tin nhắn trong conversation
- **Tải lại**: Refresh danh sách conversation

## Cấu trúc dữ liệu

### ChatHistoryItem
```typescript
interface ChatHistoryItem {
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
```

## Tính năng bổ sung

### 1. Format thời gian thông minh
- Hiển thị thời gian tương đối (phút, giờ, ngày trước)
- Fallback về định dạng ngày tháng cho thời gian xa

### 2. Hiển thị tin nhắn có ảnh
- Tag đặc biệt cho tin nhắn có đính kèm ảnh
- Hiển thị số lượng ảnh

### 3. Responsive design
- Bảng có thể scroll ngang trên màn hình nhỏ
- Pagination với tùy chọn số lượng items per page

## Lưu ý kỹ thuật

### 1. Authentication
- Tất cả API calls đều yêu cầu JWT token
- Token được lấy từ localStorage

### 2. Error handling
- Xử lý lỗi network và API
- Hiển thị thông báo lỗi thân thiện với người dùng

### 3. Performance
- Sử dụng Promise.all để load conversation details song song
- Pagination để tránh load quá nhiều dữ liệu cùng lúc

## Cách mở rộng

### 1. Thêm filter/search
- Có thể thêm search box để tìm conversation theo title
- Filter theo trạng thái, thời gian

### 2. Export dữ liệu
- Thêm chức năng export conversation ra file
- Hỗ trợ định dạng PDF, CSV

### 3. Analytics
- Thống kê số lượng conversation theo thời gian
- Phân tích nội dung tin nhắn phổ biến

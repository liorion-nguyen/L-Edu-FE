# Dashboard Overview - Hướng dẫn sử dụng

## Tổng quan
Trang Dashboard tổng quan cung cấp cái nhìn toàn diện về tình hình hoạt động của hệ thống L-Edu với các thống kê thời gian thực và biểu đồ trực quan.

## Tính năng chính

### 1. Thống kê tổng quan (Statistics Cards)
- **Tổng số người dùng**: Hiển thị số lượng người dùng đã đăng ký và phần trăm tăng trưởng
- **Tổng số khóa học**: Số lượng khóa học trong hệ thống và xu hướng tăng trưởng
- **Tổng số bài học**: Số lượng session/bài học và thống kê tăng trưởng
- **Tổng số đánh giá**: Số lượng review và điểm đánh giá trung bình
- **Cuộc trò chuyện**: Tổng số cuộc trò chuyện với AI
- **Tin nhắn**: Tổng số tin nhắn đã được gửi

### 2. Biểu đồ tăng trưởng người dùng
- **Loại**: Line Chart
- **Dữ liệu**: 30 ngày qua
- **Mục đích**: Theo dõi xu hướng đăng ký người dùng mới

### 3. Biểu đồ đăng ký khóa học
- **Loại**: Bar Chart
- **Dữ liệu**: Top 10 khóa học có nhiều đăng ký nhất
- **Mục đích**: Phân tích mức độ phổ biến của các khóa học

### 4. Biểu đồ hoạt động chat
- **Loại**: Line Chart (dual axis)
- **Dữ liệu**: 7 ngày qua
- **Mục đích**: Theo dõi hoạt động chat (số tin nhắn và cuộc trò chuyện)

### 5. Biểu đồ xu hướng đánh giá
- **Loại**: Combined Chart (Bar + Line)
- **Dữ liệu**: 30 ngày qua
- **Mục đích**: Phân tích số lượng đánh giá và điểm trung bình

### 6. Bảng hoạt động gần đây
- Hiển thị các hoạt động mới nhất của người dùng
- Bao gồm: đăng ký khóa học, hoàn thành bài học, để lại đánh giá, bắt đầu chat

## API Endpoints

### Backend APIs
```
GET /dashboard/stats - Lấy thống kê tổng quan
GET /dashboard/stats/user-growth - Lấy dữ liệu tăng trưởng người dùng
GET /dashboard/stats/course-enrollment - Lấy dữ liệu đăng ký khóa học
GET /dashboard/stats/chat-activity - Lấy dữ liệu hoạt động chat
GET /dashboard/stats/review-trends - Lấy dữ liệu xu hướng đánh giá
```

### Frontend Service
```typescript
// Sử dụng dashboardService để gọi API
import dashboardService from '../../services/dashboardService';

// Lấy thống kê tổng quan
const stats = await dashboardService.getDashboardStats();

// Lấy dữ liệu biểu đồ
const userGrowth = await dashboardService.getUserGrowthData();
const courseEnrollment = await dashboardService.getCourseEnrollmentData();
const chatActivity = await dashboardService.getChatActivityData();
const reviewTrends = await dashboardService.getReviewTrendsData();
```

## Cấu trúc dữ liệu

### DashboardStats
```typescript
interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalSessions: number;
  totalReviews: number;
  totalConversations: number;
  totalMessages: number;
  userGrowthPercentage?: number;
  courseGrowthPercentage?: number;
  sessionGrowthPercentage?: number;
  reviewGrowthPercentage?: number;
  averageRating?: number;
  activeUsersToday?: number;
  newUsersThisWeek?: number;
}
```

### UserGrowthData
```typescript
interface UserGrowthData {
  date: string;
  count: number;
}
```

### CourseEnrollmentData
```typescript
interface CourseEnrollmentData {
  course: string;
  enrollments: number;
}
```

### ChatActivityData
```typescript
interface ChatActivityData {
  date: string;
  messages: number;
  conversations: number;
}
```

### ReviewTrendsData
```typescript
interface ReviewTrendsData {
  date: string;
  reviews: number;
  averageRating: number;
}
```

## Styling và Theme

### CSS Classes
- `.dashboard-container`: Container chính
- `.dashboard-title`: Tiêu đề trang
- `.statistics-card`: Card thống kê
- `.statistics-icon`: Icon và tiêu đề thống kê
- `.statistics-change`: Phần trăm thay đổi
- `.statistics-suffix`: Thông tin bổ sung
- `.chart-card`: Card biểu đồ
- `.chart-container`: Container biểu đồ
- `.activity-table`: Bảng hoạt động
- `.dashboard-loading`: Trạng thái loading
- `.dashboard-error`: Trạng thái lỗi

### Theme Support
Dashboard hỗ trợ cả light và dark theme thông qua CSS variables:
- `--bg-primary`: Màu nền chính
- `--bg-secondary`: Màu nền phụ
- `--text-primary`: Màu chữ chính
- `--text-secondary`: Màu chữ phụ
- `--border-color`: Màu viền

## Responsive Design
- **Desktop (≥1200px)**: Hiển thị 6 cột cho statistics cards
- **Tablet (768px-1199px)**: Hiển thị 3 cột cho statistics cards
- **Mobile (<768px)**: Hiển thị 1 cột cho statistics cards
- Biểu đồ tự động điều chỉnh kích thước theo màn hình

## Xử lý lỗi
- Hiển thị loading spinner khi đang tải dữ liệu
- Hiển thị thông báo lỗi nếu không thể tải dữ liệu
- Fallback về dữ liệu mặc định nếu API không trả về dữ liệu

## Tối ưu hóa
- Sử dụng `Promise.all()` để gọi nhiều API đồng thời
- Lazy loading cho các component biểu đồ
- Memoization cho các tính toán phức tạp
- Responsive images và charts

## Cách thêm biểu đồ mới
1. Tạo API endpoint trong backend
2. Thêm method trong `dashboardService.ts`
3. Thêm state và useEffect trong component
4. Thêm biểu đồ vào JSX với ResponsiveContainer
5. Cập nhật CSS nếu cần

## Dependencies
- **recharts**: Thư viện biểu đồ
- **antd**: UI components
- **axios**: HTTP client
- **React Hooks**: useState, useEffect

## Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

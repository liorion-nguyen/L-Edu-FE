# Recent Activities Feature - Real Data Implementation

## ✅ Đã thay thế Mock Data bằng Real Data

### Trước (Mock Data)
```typescript
const recentActivities = [
  {
    key: "1",
    user: "Nguyễn Văn A",
    action: "Đăng ký khóa học",
    course: "React Native từ A-Z",
    time: "2 giờ trước",
    status: "success",
  },
  // ... more mock data
];
```

### Sau (Real Data từ API)
```typescript
const [recentActivities, setRecentActivities] = useState<any[]>([]);

// Fetch từ API
const recentActivitiesResponse = await dashboardService.getRecentActivities();
setRecentActivities(recentActivitiesResponse);
```

## 📊 Dữ liệu thu thập

### 1. Course Enrollments (Đăng ký khóa học)
- Lấy từ: `courses` collection
- Điều kiện: Có `students` array không rỗng
- Sort: Theo `updatedAt` (mới nhất)
- Limit: Top 10
- Status: `success`

**Aggregation Pipeline:**
```typescript
{
  $match: { students: { $exists: true, $ne: [] } },
  $unwind: '$students',
  $sort: { updatedAt: -1 },
  $limit: 10,
  $lookup: { from: 'users', localField: 'students', foreignField: '_id', as: 'userInfo' },
  $project: {
    user: '$userInfo.name',
    action: 'enrolled_course',
    course: '$title',
    createdAt: '$updatedAt',
    status: 'success'
  }
}
```

### 2. Reviews (Đánh giá)
- Lấy từ: `reviews` collection
- Sort: Theo `createdAt` (mới nhất)
- Limit: Top 10
- Status: `processing`

**Aggregation Pipeline:**
```typescript
{
  $sort: { createdAt: -1 },
  $limit: 10,
  $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' },
  $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'courseInfo' },
  $project: {
    user: '$userInfo.name',
    action: 'left_review',
    course: '$courseInfo.title',
    createdAt: '$createdAt',
    status: 'processing'
  }
}
```

### 3. Chat Conversations (Cuộc trò chuyện)
- Lấy từ: `conversations` collection
- Sort: Theo `createdAt` (mới nhất)
- Limit: Top 10
- Status: `default`

**Aggregation Pipeline:**
```typescript
{
  $sort: { createdAt: -1 },
  $limit: 10,
  $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' },
  $project: {
    user: '$userInfo.name',
    action: 'started_chat',
    course: '$title',
    createdAt: '$createdAt',
    status: 'default'
  }
}
```

## 🔄 Data Flow

```
Backend Aggregation (3 pipelines)
    ↓
Merge & Sort by createdAt
    ↓
Take Top 20 activities
    ↓
Format time (formatTimeAgo)
    ↓
Return to Frontend
    ↓
Display in Table
```

## ⏰ Time Formatting

Hàm `formatTimeAgo()` chuyển đổi timestamp thành format dễ đọc:

```typescript
private formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return 'Vừa xong';
}
```

## 📝 Action Labels

Frontend map action types sang labels tiếng Việt:

```typescript
const actionMap: Record<string, string> = {
  'enrolled_course': 'Đăng ký khóa học',
  'completed_session': 'Hoàn thành bài học',
  'left_review': 'Để lại đánh giá',
  'started_chat': 'Bắt đầu chat'
};
```

## 🎨 Status Colors

```typescript
const statusConfig = {
  success: { color: "green", text: "Thành công" },
  processing: { color: "blue", text: "Đang xử lý" },
  default: { color: "default", text: "Mới" },
};
```

## 📋 Response Format

```typescript
{
  key: string;           // Index as string
  user: string;          // User name
  action: string;        // Action type (enrolled_course, left_review, etc.)
  course: string;        // Course title or conversation title
  time: string;          // Formatted time ago
  createdAt: Date;       // Original timestamp
  status: string;        // success | processing | default
}
```

## 🔐 API Endpoints

### Backend
```
GET /dashboard/recent-activities
- Auth: Required (JWT)
- Roles: ADMIN, TEACHER
- Response: Array<ActivityItem>
```

### Frontend Service
```typescript
async getRecentActivities(): Promise<any[]> {
  const response = await axios.get(
    `${envConfig.serverURL}/dashboard/recent-activities`,
    { headers: this.getAuthHeaders() }
  );
  return response.data;
}
```

## 📊 Table Display

Ant Design Table với các columns:
1. **Người dùng** - User name
2. **Hoạt động** - Action label (translated)
3. **Khóa học** - Course/conversation title
4. **Thời gian** - Time ago format
5. **Trạng thái** - Color-coded status tag

## 🚀 Features

✅ **Real-time Data**: Fetch từ database
✅ **Multi-source**: Combine 3 data sources
✅ **Smart Sorting**: Sort by timestamp
✅ **Time Formatting**: Human-readable time
✅ **Action Translation**: Vietnamese labels
✅ **Status Indicators**: Color-coded tags
✅ **Pagination**: Ant Design built-in
✅ **Responsive**: Mobile-friendly table

## 🎯 Use Cases

1. **Monitor User Activity**: Xem người dùng đang làm gì
2. **Track Engagement**: Đo lường tương tác
3. **Recent Events**: Sự kiện mới nhất
4. **Quick Overview**: Cái nhìn tổng quan nhanh

## 🔧 Customization

### Thêm loại hoạt động mới:

1. **Backend**: Thêm aggregation pipeline
```typescript
const newActivity = await this.someModel.aggregate([
  // ... pipeline
  { $project: { action: 'new_action_type', ... } }
]);
activities.push(...newActivity);
```

2. **Frontend**: Thêm vào actionMap
```typescript
const actionMap = {
  // ...existing
  'new_action_type': 'Label mới'
};
```

### Thay đổi số lượng hiển thị:

```typescript
// Backend - Change limit
.slice(0, 50)  // Show 50 instead of 20

// Frontend - Change pagination
pagination={{ pageSize: 10 }}  // 10 per page
```

## 🐛 Error Handling

```typescript
try {
  // Fetch activities
  const activities = await getRecentActivities();
  // ...
} catch (error) {
  console.error('Error fetching recent activities:', error);
  return []; // Return empty array on error
}
```

## 📈 Performance

- **Aggregation**: Efficient MongoDB pipelines
- **Limit**: Only fetch top 10 from each source
- **Single Request**: Combine all data server-side
- **Caching**: Can add Redis caching if needed

## 🧪 Testing

```bash
# Backend
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/dashboard/recent-activities

# Frontend
# Navigate to Dashboard and check table
# Should show real user activities with timestamps
```

## 📚 Documentation

- Backend: `L-Edu-BE/src/api/dashboard/dashboard.service.ts`
- Frontend: `L-Edu-FE/src/pages/dashboard/DashboardHome.tsx`
- Service: `L-Edu-FE/src/services/dashboardService.ts`

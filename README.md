![Logo](./public/images/auth/logo.png)

![Logo](./public/assets/logo.png)

# L Edu - Nền Tảng Học Lập Trình Toàn Diện

## Mô Tả:

**L Edu** là nền tảng học lập trình dành cho mọi lứa tuổi, từ **Kidteen đến 18+**, giúp người học tiếp cận các khóa học lập trình một cách trực quan và hiệu quả. Website cung cấp nhiều khóa học từ cơ bản đến nâng cao, bao gồm:

- **Lập trình Web** (HTML, CSS, JavaScript, React,...)
- **Lập trình App** (React Native,...)
- **Ngôn ngữ lập trình** (C++, Python, Java,...)

L Edu giúp học viên tiếp cận kiến thức một cách có hệ thống, dễ hiểu thông qua các khóa học được thiết kế chuyên nghiệp bởi các giảng viên giàu kinh nghiệm.

## **Các Tính Năng Chính:**

- **Duyệt và đăng ký khóa học**: Người dùng có thể xem danh sách các khóa học, chi tiết nội dung khóa học, và đăng ký trực tuyến.
- **Tìm kiếm và lọc khóa học**: Hỗ trợ tìm kiếm khóa học theo chủ đề, độ khó và sở thích cá nhân.
- **Hệ thống học tập cá nhân hóa**: Theo dõi tiến trình học tập, đánh giá kết quả học viên.
- **Diễn đàn thảo luận**: Học viên có thể đặt câu hỏi, thảo luận và chia sẻ kinh nghiệm.
- **Hệ thống đánh giá khóa học**: Học viên có thể để lại đánh giá và nhận xét sau khi hoàn thành khóa học.
- **🎨 Hỗ trợ Dark/Light Theme**: Giao diện tự động thích ứng với thiết lập theme của hệ thống, bao gồm cả nội dung markdown.
- **📖 Markdown Viewer nâng cao**: Hiển thị nội dung markdown với styling đẹp mắt, hỗ trợ syntax highlighting cho code.

## **Tính Năng UI/UX Mới:**

### **🌓 Adaptive Theme Support**
- **Tự động phát hiện theme**: Hệ thống tự động phát hiện và áp dụng theme sáng/tối dựa trên thiết lập của người dùng
- **Markdown responsive**: Nội dung markdown tự động chuyển đổi màu sắc phù hợp với theme
- **Syntax highlighting thông minh**: Code blocks sử dụng GitHub theme tương ứng (github/github-dark)

### **🎨 Enhanced Styling**
- **Glassmorphism effects**: Hiệu ứng kính mờ hiện đại cho các component
- **Elegant color palette**: Bảng màu teal thanh lịch, ít chói mắt hơn
- **Smooth transitions**: Chuyển đổi mượt mà giữa các trạng thái
- **Responsive design**: Tối ưu cho mọi kích thước màn hình

### **📝 Markdown Features**
- **Theme-aware colors**: Màu sắc tự động thích ứng với theme
- **Enhanced typography**: Font chữ và spacing được tối ưu
- **Beautiful code blocks**: Syntax highlighting với border và shadow
- **Styled tables**: Bảng với border rounded và striped rows
- **Interactive elements**: Links và buttons với hover effects

## **Công Nghệ Sử Dụng:**

- **[React](https://reactjs.org/)**: Xây dựng giao diện người dùng nhanh chóng, tối ưu hóa hiệu suất.
- **[NestJS](https://nestjs.com/)** (Node.js): Xây dựng backend mạnh mẽ, linh hoạt với mô hình MVC.
- **[Redux](https://redux.js.org/)**: Quản lý trạng thái toàn cục, giúp đồng bộ dữ liệu hiệu quả.
- **[Ant Design](https://ant.design/)**: Giao diện đẹp mắt, chuyên nghiệp với các thành phần UI mạnh mẽ.
- **[MongoDB](https://www.mongodb.com/)**: Cơ sở dữ liệu NoSQL linh hoạt, phù hợp với dữ liệu động của hệ thống.
- **[React Markdown](https://github.com/remarkjs/react-markdown)**: Hiển thị nội dung markdown với syntax highlighting.
- **[Highlight.js](https://highlightjs.org/)**: Syntax highlighting cho code blocks với theme adaptive.

## **[Link Website](https://l-edu.vercel.app/)**

## **Hướng Dẫn Cài Đặt**

### **1. Clone Repository:**
```bash
git clone https://github.com/liorion-nguyen/l-edu.git
cd l-edu
```

### **2. Cài Đặt Dependencies:**
```bash
# Cài đặt frontend
cd frontend
npm install

# Cài đặt backend
cd ../backend
npm install
```

### **3. Cấu Hình Môi Trường:**
Tạo file `.env` trong thư mục `backend` và thêm các thông tin sau:
```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

### **4. Chạy Dự Án:**
```bash
# Chạy backend
cd backend
npm run start

# Chạy frontend
cd ../frontend
npm start
```

Dự án sẽ chạy trên `http://localhost:3000/` cho frontend và `http://localhost:5000/` cho backend.

---

## **Tùy Chỉnh Theme**

### **CSS Custom Properties**
Hệ thống sử dụng CSS custom properties để hỗ trợ theme switching:

```css
/* Light theme */
--markdown-bg: rgba(255, 255, 255, 0.95);
--markdown-text: #2c3e50;
--markdown-border: rgba(78, 205, 196, 0.2);

/* Dark theme */
--markdown-bg: rgba(26, 74, 74, 0.95);
--markdown-text: #B0E0E6;
--markdown-border: rgba(78, 205, 196, 0.3);
```

### **Responsive Breakpoints**
```css
/* Mobile */
@media (max-width: 768px) {
  /* Mobile-specific styles */
}

/* Tablet and Desktop */
@media (min-width: 769px) {
  /* Larger screen styles */
}
```

## **Đóng Góp**
Nếu bạn muốn đóng góp vào dự án, vui lòng tạo Pull Request hoặc liên hệ với chúng tôi qua email: **ledu.support@gmail.com**.

## **Liên Hệ**
📍 **Địa chỉ:** Hà Nội, Việt Nam  
📧 **Email:** liorion.nguyen@gmail.com  
📞 **Điện thoại:** (+84) 708-200-334

Cảm ơn bạn đã quan tâm đến **L Edu**! 🚀
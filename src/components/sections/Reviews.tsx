import { Col, Row, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import React, { CSSProperties } from "react";

const { Text } = Typography;

const Review = () => {
  const reviews = [
    {
      name: "Nguyễn Văn A",
      learn: "React Native",
      review:
        "Khoá học rất bổ ích! Giảng viên hướng dẫn chi tiết, giúp mình hiểu rõ cách xây dựng ứng dụng di động với React Native. Mình có thể tự tin làm một app cơ bản sau khi hoàn thành khoá học.",
      avatar: "https://tranhtomau.mobi/upload/2024/05/100-hinh-anh-hoc-sinh-chibi-de-thuong-tai-ve-dien-thoai-mien-phi-2.webp",
    },
    {
      name: "Trần Thị Bích Ngọc",
      learn: "ReactJs",
      review:
        "Mình đã học nhiều khoá về lập trình trước đây nhưng đây là khoá React Native dễ hiểu nhất. Giảng viên dạy rất có tâm, nội dung bài học thực tế và có nhiều bài tập giúp mình thực hành ngay.",
      avatar: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-hoc-sinh-6.jpg",
    },
    {
      name: "Lê Minh Tuấn",
      learn: "React Native",
      review:
        "Khoá học tuyệt vời! Mình đã có chút kiến thức về JavaScript, sau khi học xong khoá này mình có thể tự viết ứng dụng React Native hoàn chỉnh. Cảm ơn đội ngũ giảng viên!",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX6AjH5X1zIydhSZCP4kzOGCqjl79IsT1Xzg&s",
    },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Row style={{ paddingBottom: "60px" }} justify="center">
        <Col span={24}>
          <Title level={2} style={styles.title}>
            Our Students Reviews
          </Title>
        </Col>
        <Col span={24}>
          <Row justify="center" gutter={[40, 20]}>
            {reviews.map((review, index) => (
              <Col key={index} lg={8} md={12} sm={24} xs={24}>
                <Space direction="vertical" style={styles.card}>
                  <img src={review.avatar} alt={review.name} style={styles.avatar} />
                  <Text style={styles.name}>{review.name}</Text>
                  <Text style={styles.learn}>{review.learn}</Text>
                  <Text style={styles.reviewText}>{review.review}</Text>
                </Space>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default Review;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  card: CSSProperties;
  avatar: CSSProperties;
  name: CSSProperties;
  learn: CSSProperties;
  reviewText: CSSProperties;
} = {
  sectionLayout: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  title: {
    textAlign: "center",
    color: "#B0E0E6", // Pale teal for title
    textShadow: "0 0 10px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(15px)",
    borderRadius: "30px",
    padding: "70px 20px 20px 20px",
    position: "relative",
    marginTop: "50px",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  avatar: {
    height: "100px",
    width: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    position: "absolute",
    top: "-50px",
    border: "5px solid #4ECDC4", // Brighter teal border
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 0 10px rgba(78, 205, 196, 0.5)", // Teal glow
  },
  name: {
    textAlign: "center",
    marginTop: "10px",
    color: "#B0E0E6", // Pale teal for name
    fontWeight: 500,
    fontSize: "18px",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  learn: {
    textAlign: "center",
    marginTop: "10px",
    color: "#4ECDC4", // Brighter teal for course name
  },
  reviewText: {
    textAlign: "center",
    marginTop: "10px",
    color: "#B0E0E6", // Pale teal for review text
    fontSize: "14px",
    lineHeight: "1.6",
  },
};

// Add hover effects using CSS
const styleSheetReview = document.createElement("style");
styleSheetReview.innerText = `
  .review-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetReview);
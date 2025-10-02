import { Col, Row, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { COLORS } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";

const { Text } = Typography;

const Review = () => {
  const { t } = useTranslationWithRerender();
  
  const reviews = [
    {
      name: "Nguyễn Văn A",
      learn: "React Native",
      review: t('reviews.review1'),
      avatar: "https://tranhtomau.mobi/upload/2024/05/100-hinh-anh-hoc-sinh-chibi-de-thuong-tai-ve-dien-thoai-mien-phi-2.webp",
    },
    {
      name: "Trần Thị Bích Ngọc",
      learn: "ReactJs",
      review: t('reviews.review2'),
      avatar: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-hoc-sinh-6.jpg",
    },
    {
      name: "Lê Minh Tuấn",
      learn: "React Native",
      review: t('reviews.review3'),
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX6AjH5X1zIydhSZCP4kzOGCqjl79IsT1Xzg&s",
    },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Row style={{ paddingBottom: "60px" }} justify="center">
        <Col span={24}>
          <Title level={2} style={styles.title}>
            {t('reviews.title')}
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
    background: "var(--bg-secondary)",
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
  },
  title: {
    textAlign: "center",
    color: "var(--text-primary)",
    fontSize: "36px",
    fontWeight: 600,
    marginBottom: "40px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "var(--bg-primary)",
    borderRadius: "24px",
    padding: "70px 20px 20px 20px",
    position: "relative",
    marginTop: "50px",
    border: "1px solid var(--border-color)",
  },
  avatar: {
    height: "100px",
    width: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    position: "absolute",
    top: "-50px",
    border: `5px solid ${COLORS.primary[500]}`,
    left: "50%",
    transform: "translateX(-50%)",
  },
  name: {
    textAlign: "center",
    marginTop: "10px",
    color: COLORS.text.heading,
    fontWeight: 600,
    fontSize: "18px",
  },
  learn: {
    textAlign: "center",
    marginTop: "10px",
    color: COLORS.accent[600],
    fontWeight: 500,
    fontSize: "14px",
  },
  reviewText: {
    textAlign: "center",
    marginTop: "10px",
    color: COLORS.text.primary,
    fontSize: "14px",
    lineHeight: "1.6",
  },
};
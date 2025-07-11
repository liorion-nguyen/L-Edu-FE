import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";

const ExploreCategories = () => {
  const categories = [
    { id: 1, name: "Web Basic", image: "/images/landing/sections/categories/web-basic.png", courses: 25 },
    { id: 2, name: "Web Developer", image: "/images/landing/sections/categories/web-developer.png", courses: 18 },
    { id: 3, name: "Computer Science", image: "/images/landing/sections/categories/computer-science.png", courses: 32 },
    { id: 4, name: "App Producer", image: "/images/landing/sections/categories/app-producer.png", courses: 12 },
    { id: 5, name: "Data Science", image: "/images/landing/sections/categories/data-science.png", courses: 28 },
    { id: 6, name: "React & React Native", image: "/images/landing/sections/categories/react&react-native.png", courses: 22 },
    { id: 7, name: "JavaScript Basic", image: "/images/landing/sections/categories/javascript-basic.png", courses: 15 },
    { id: 8, name: "Codementum", image: "/images/landing/sections/categories/codementum.png", courses: 10 },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Title level={2} style={styles.title}>
        Explore Categories
      </Title>
      <Row gutter={[24, 24]} justify="center">
        {categories.map((category) => (
          <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
            <div style={styles.categoryCard}>
              <div style={styles.imageContainer}>
                <img src={category.image} alt={category.name} style={styles.image} />
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.categoryName}>{category.name}</h3>
                <p style={styles.courseCount}>{category.courses} Courses</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </SectionLayout>
  );
};

export default ExploreCategories;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  categoryCard: CSSProperties;
  imageContainer: CSSProperties;
  image: CSSProperties;
  cardContent: CSSProperties;
  categoryName: CSSProperties;
  courseCount: CSSProperties;
} = {
  sectionLayout: {
    background: COLORS.background.primary,
    padding: `${SPACING.xl} 0`,
  },
  title: {
    textAlign: "center",
    color: COLORS.text.heading,
    marginBottom: SPACING.xl,
    fontSize: "2.5rem",
    fontWeight: 600,
  },
  categoryCard: {
    background: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    textAlign: "center",
    height: "100%",
    border: `1px solid ${COLORS.border.light}`,
    cursor: "pointer",
  },
  imageContainer: {
    marginBottom: SPACING.md,
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: RADIUS.md,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: SPACING.xs,
  },
  categoryName: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: COLORS.text.heading,
    margin: 0,
  },
  courseCount: {
    fontSize: "0.9rem",
    color: COLORS.text.secondary,
    margin: 0,
  },
};
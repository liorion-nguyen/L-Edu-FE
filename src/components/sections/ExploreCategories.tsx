import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { Typography } from "antd";
import SectionLayout from "../../layouts/SectionLayout";
import { CSSProperties } from "react";

const { Text } = Typography;

const ExploreCategories = () => {
  const categories = [
    { name: "React Native", lesson: 20, icon: "/images/landing/sections/categories/react&react-native.png", handle: () => {} },
    { name: "React", lesson: 20, icon: "/images/landing/sections/categories/react&react-native.png", handle: () => {} },
    { name: "Website Basic", lesson: 20, icon: "/images/landing/sections/categories/web-basic.png", handle: () => {} },
    { name: "Web Developer", lesson: 42, icon: "/images/landing/sections/categories/web-developer.png", handle: () => {} },
    { name: "App Producer", lesson: 42, icon: "/images/landing/sections/categories/app-producer.png", handle: () => {} },
    { name: "Computer Science", lesson: 42, icon: "/images/landing/sections/categories/computer-science.png", handle: () => {} },
    { name: "Codementum", lesson: 10, icon: "/images/landing/sections/categories/codementum.png", handle: () => {} },
    { name: "Data Science", lesson: 10, icon: "/images/landing/sections/categories/data-science.png", handle: () => {} },
    { name: "Javascript Basic", lesson: 20, icon: "/images/landing/sections/categories/javascript-basic.png", handle: () => {} },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Row justify="center">
        <Col span={24} style={{ paddingBottom: "40px" }}>
          <Title level={2} style={styles.title}>
            Explore Our Categories
          </Title>
        </Col>
        <Col span={24}>
          <Row gutter={[20, 20]}>
            {categories.map((category, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Row
                  gutter={[10, 10]}
                  justify="space-between"
                  align="middle"
                  style={styles.categoryCard}
                  onClick={category.handle}
                >
                  <Col style={{ width: "60px", height: "50px" }}>
                    <img src={category.icon} alt={category.name} style={styles.icon} />
                  </Col>
                  <Col flex="auto">
                    <Title level={4} style={styles.categoryName}>
                      {category.name}
                    </Title>
                    <Text style={styles.lessonText}>{category.lesson} lessons</Text>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default ExploreCategories;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  categoryCard: CSSProperties;
  icon: CSSProperties;
  categoryName: CSSProperties;
  lessonText: CSSProperties;
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
  categoryCard: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(15px)",
    borderRadius: "50px",
    padding: "10px 20px",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  icon: {
    width: "100%",
    height: "100%",
    filter: "brightness(0.8) hue-rotate(180deg)", // Adjust icon color to match teal theme
  },
  categoryName: {
    marginTop: 0,
    color: "#B0E0E6", // Pale teal for category name
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  lessonText: {
    color: "#4ECDC4", // Brighter teal for lesson count
    fontSize: "16px",
  },
};

// Add hover effects using CSS
const styleSheetCategories = document.createElement("style");
styleSheetCategories.innerText = `
  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetCategories);
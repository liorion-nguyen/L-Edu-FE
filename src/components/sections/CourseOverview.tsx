import { Button, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { CheckOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { CSSProperties } from "react";

const { Text } = Typography;

const CourseOverview = () => {
  const reviews = [
    "This course and was amazed by how much I learned",
    "The instructors were knowledgeable and engaging",
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Row
        gutter={{ xs: 20, sm: 40, md: 80, lg: 120, xl: 160, xxl: 200 }}
        align="bottom"
        justify="center"
      >
        <Col md={24} lg={24} xl={9} style={{ textAlign: "center" }}>
          <img
            src="/images/landing/sections/categories/course-overview.png"
            alt="Course Overview"
            style={styles.image}
          />
        </Col>
        <Col md={24} lg={24} xl={15} style={{ paddingBottom: "30px" }}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Title level={2} style={styles.title}>
                Our courses cover a range of topics, including accounting, finance, and more
              </Title>
            </Col>
            <Col span={24}>
              <Text style={styles.description}>
                You'll have access to expert instructors and comprehensive course materials, as well as the opportunity to work on real-world projects and assignments.
              </Text>
            </Col>
            <Col span={24}>
              {reviews.map((review, index) => (
                <Row key={index} gutter={[10, 10]} align="middle">
                  <Col>
                    <CheckOutlined style={styles.checkIcon} />
                  </Col>
                  <Col>
                    <Text style={styles.reviewText}>{review}</Text>
                  </Col>
                </Row>
              ))}
            </Col>
            <Col span={24}>
              <Button style={styles.button}>Read more</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default CourseOverview;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  description: CSSProperties;
  checkIcon: CSSProperties;
  reviewText: CSSProperties;
  button: CSSProperties;
  image: CSSProperties;
} = {
  sectionLayout: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    padding: "80px 0",
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  title: {
    color: "#B0E0E6", // Pale teal for title
    textShadow: "0 0 10px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  description: {
    color: "#B0E0E6", // Pale teal for description
    fontSize: "17px",
    lineHeight: "1.8",
  },
  checkIcon: {
    background: "#4ECDC4", // Brighter teal for icon background
    borderRadius: "50%",
    padding: "3px",
    color: "#0A2E2E", // Dark teal for icon
  },
  reviewText: {
    color: "#B0E0E6", // Pale teal for review text
    fontSize: "15px",
  },
  button: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(78, 205, 196, 0.5)", // Teal glow
    transition: "box-shadow 0.3s",
    fontWeight: 500,
    color: "#B0E0E6", // Pale teal for button text
  },
  image: {
    maxWidth: "100%",
    borderRadius: "16px",
    filter: "brightness(0.7)",
    transition: "filter 0.3s",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(78, 205, 196, 0.2)", // Teal glow
  },
};

// Add hover effects using CSS
const styleSheetOverview = document.createElement("style");
styleSheetOverview.innerText = `
  .overview-image:hover {
    filter: brightness(1);
  }
  .overview-button:hover {
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.7);
  }
`;
document.head.appendChild(styleSheetOverview);
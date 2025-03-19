import { Avatar, Col, Image, Row, Typography } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { CSSProperties } from "react";

const { Text } = Typography;

const ImageHero = ({ path, alt }: { path: string; alt: string }) => {
  return <Image src={path} alt={alt} style={styles.img} />;
};

const Hero = () => {
  return (
    <SectionLayout style={styles.sectionLayout}>
      <Title level={1} style={styles.title}>
        Advance Your Career with Our Online Courses
      </Title>
      <Row justify="space-between" align="bottom" gutter={[30, 30]} style={{ paddingBottom: "60px" }}>
        <Col lg={10} md={10} sm={24} xs={24}>
          <ImageHero path="/images/landing/sections/hero/hero1.png" alt="hero1" />
        </Col>
        <Col lg={14} md={14} sm={24} xs={24}>
          <Row justify="end">
            <Text style={styles.subtitle}>
              Our courses cover a range of topics, including accounting, finance, marketing, human resources, and more. You'll have access to expert instructors
            </Text>
          </Row>
          <Row gutter={[30, 30]} align="bottom">
            <Col lg={14} md={14} sm={24} xs={24}>
              <ImageHero path="/images/landing/sections/hero/hero2.png" alt="hero2" />
            </Col>
            <Col lg={10} md={10} sm={24} xs={24}>
              <Row justify="center" align="middle" style={{ flexDirection: "column", textAlign: "center" }}>
                <Col>
                  <Avatar.Group>
                    <Avatar
                      src="https://pngimg.com/uploads/student/student_PNG62560.png"
                      style={styles.avatar}
                      size={40}
                    />
                    <Avatar
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZFKQxbj4IBPdrWQQcdv_c3hWHe-nwjXk6xJs77n11_p0KaE5ZUO2QuF9ge1aECWezbWs&usqp=CAU"
                      style={styles.avatar}
                      size={40}
                    />
                    <Avatar
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-t7aoG_itYbGrEkhCckwclpEfElHkxl1ScA&s"
                      style={styles.avatar}
                      size={40}
                    />
                  </Avatar.Group>
                  <Text style={styles.textCountEnrolled}>200k Enrolled Students</Text>
                </Col>
                <ImageHero path="/images/landing/sections/hero/hero3.png" alt="hero3" />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default Hero;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  img: CSSProperties;
  avatar: CSSProperties;
  textCountEnrolled: CSSProperties;
} = {
  sectionLayout: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  title: {
    fontSize: "4.5rem",
    fontWeight: "bold",
    marginBottom: "40px",
    textAlign: "right",
    color: "#B0E0E6", // Pale teal for the title
    textShadow: "0 0 10px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  subtitle: {
    display: "block",
    fontSize: "1.2rem",
    marginBottom: "20px",
    color: "#B0E0E6", // Pale teal for subtitle
    width: "70%",
    lineHeight: "1.8",
  },
  img: {
    borderRadius: "16px",
    width: "100%",
    filter: "brightness(0.7)",
    transition: "filter 0.3s",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  avatar: {
    border: "2px solid #4ECDC4", // Brighter teal border
    boxShadow: "0 0 10px rgba(78, 205, 196, 0.5)", // Teal glow
  },
  textCountEnrolled: {
    width: "fit-content",
    color: "#B0E0E6", // Pale teal for text
    fontSize: "16px",
    margin: "10px 0",
  },
};

// Add hover effects using CSS
const styleSheetHero = document.createElement("style");
styleSheetHero.innerText = `
  .hero-img:hover {
    filter: brightness(1);
  }
`;
document.head.appendChild(styleSheetHero);
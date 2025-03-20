import { Button, Col, Grid, Input, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { SendOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";

const { useBreakpoint } = Grid;

const SubscribeSection = () => {
  const screens = useBreakpoint();

  const getPadding = () => {
    if (screens.lg) return "50px 25%";
    if (screens.md) return "50px 10%";
    if (screens.sm) return "50px 5%";
    return "50px 0";
  };

  return (
    <SectionLayout style={styles.section}>
      <Row
        style={{ ...styles.container, padding: getPadding() }}
        justify="center"
        align="middle"
        gutter={[0, 20]}
      >
        <Title level={2} style={styles.title}>
          If you’re interested in our courses and want to know our latest news, please subscribe to our newsletter
        </Title>
        <Col span={24}>
          <div style={styles.form}>
            <Input placeholder="Enter your email" style={styles.input} />
            <Button
              style={styles.button}
              icon={screens.md ? undefined : <SendOutlined />}
            >
              {screens.md ? "Subscribe" : ""}
            </Button>
          </div>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default SubscribeSection;

const styles: {
  section: CSSProperties;
  container: CSSProperties;
  title: CSSProperties;
  form: CSSProperties;
  input: CSSProperties;
  button: CSSProperties;
} = {
  section: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    padding: "50px 0",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  container: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    borderRadius: 30,
    transition: "box-shadow 0.3s",
  },
  title: {
    textAlign: "center",
    color: "#B0E0E6", // Pale teal for text
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  form: {
    // border: 0,
    borderRadius: "20px",
    padding: "10px 20px",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "box-shadow 0.3s",
  },
  input: {
    background: "transparent",
    border: "none",
    boxShadow: "none",
    fontSize: "16px",
    flex: 1,
    color: "#B0E0E6", // Pale teal for text
  },
  button: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    color: "#B0E0E6", // Pale teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
    fontSize: "16px",
  },
};

// Add hover effects and animations using CSS
const styleSheetSubscribe = document.createElement("style");
styleSheetSubscribe.innerText = `
  .subscribe-container:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .subscribe-form:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .subscribe-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetSubscribe);
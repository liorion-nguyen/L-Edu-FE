import React from "react";
import { Layout, Row, Col, Typography } from "antd";
import { CSSProperties } from "react";

const { Content } = Layout;
const { Text } = Typography;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout style={styles.layout}>
      <Row style={{ width: "100%", height: "100vh" }}>
        {/* Tech Graphic Section */}
        <Col xs={0} sm={0} md={12} lg={16} style={styles.graphicSection}>
          <div style={styles.graphicContainer}>
            <img
              src="/images/auth/auth-bg.png" // Placeholder for a tech-inspired graphic (e.g., circuit board, coding symbols)
              alt="Tech Illustration"
              style={styles.graphic}
            />
          </div>
        </Col>

        {/* Form Section */}
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={8}
          style={styles.formSection}
        >
          <div style={styles.logoContainer}>
            <img src="/logo.png" style={styles.logo} alt="logo" />
          </div>
          <Content style={styles.content}>{children}</Content>
          <Text style={styles.footerText}>
            © 2025 - Bản quyền thuộc về{" "}
            <Text style={styles.footerLink}>L-Edu</Text>.
          </Text>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;

const styles: {
  layout: CSSProperties;
  graphicSection: CSSProperties;
  graphicContainer: CSSProperties;
  graphic: CSSProperties;
  slogan: CSSProperties;
  formSection: CSSProperties;
  logoContainer: CSSProperties;
  logo: CSSProperties;
  content: CSSProperties;
  footerText: CSSProperties;
  footerLink: CSSProperties;
} = {
  layout: {
    minHeight: "100vh", // Ensure the layout takes up the full viewport height
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient for the entire page
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  graphicSection: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  graphicContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  graphic: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "drop-shadow(0 0 10px rgba(78, 205, 196, 0.3))", // Teal glow
  },
  slogan: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "18px",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    marginTop: "20px",
  },
  formSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    padding: "40px",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    borderLeft: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  logo: {
    width: "80%",
    maxWidth: "200px",
    filter: "drop-shadow(0 0 5px rgba(78, 205, 196, 0.3))", // Teal glow
    transition: "filter 0.3s",
  },
  content: {
    width: "100%",
    maxWidth: "400px",
  },
  footerText: {
    fontSize: "14px",
    color: "#B0E0E6", // Pale teal for text
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  footerLink: {
    color: "#4ECDC4", // Brighter teal for links
    fontWeight: "bold",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
};

// Add hover effects and animations using CSS
const styleSheetAuthLayout = document.createElement("style");
styleSheetAuthLayout.innerText = `
  .form-section:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .logo:hover {
    filter: drop-shadow(0 0 10px rgba(78, 205, 196, 0.5));
  }
`;
document.head.appendChild(styleSheetAuthLayout);
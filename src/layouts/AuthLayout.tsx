import { Col, Layout, Row, Typography } from "antd";
import React, { CSSProperties } from "react";
import { COLORS } from "../constants/colors";

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
        <Col xs={0} sm={0} md={12} lg={14} style={styles.graphicSection}>
          <div style={styles.graphicContainer}>
            <img
              src="/images/auth/auth-bg.png" 
              alt="Tech Illustration"
              style={styles.graphic}
            />
          </div>
        </Col>

        {/* Form Section */}
        <Col xs={24} sm={24} md={12} lg={10} style={styles.formSection}>
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
    minHeight: "100vh",
    background: COLORS.background.secondary,
    position: "relative",
    overflow: "hidden",
  },
  graphicSection: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  graphicContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  graphic: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  slogan: {
    color: COLORS.text.primary,
    fontSize: "18px",
    marginTop: "20px",
  },
  formSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    padding: "40px",
    background: COLORS.background.primary,
    borderLeft: `1px solid ${COLORS.border.light}`,
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  logo: {
    width: "80%",
    maxWidth: "200px",
  },
  content: {
    width: "100%",
    maxWidth: "400px",
  },
  footerText: {
    fontSize: "14px",
    color: COLORS.text.secondary,
  },
  footerLink: {
    color: COLORS.primary[500],
    fontWeight: "bold",
  },
};
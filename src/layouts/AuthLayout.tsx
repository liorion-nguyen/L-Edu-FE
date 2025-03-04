import React from "react";
import { Layout, Row, Col } from "antd";
import { Typography } from "antd";

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}
const { Text } = Typography;

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Row style={{ width: "100%", height: "100vh" }}>
        <Col xs={0} sm={0} md={12} lg={16}  style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <img
            src="/images/auth/auth-bg.png"
            alt="Auth Illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} span={8} style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", gap: "40px", padding: "40px" }}>
          <img src="/images/auth/logo.png" style={{ width: "40%", marginTop: "30px" }} alt="logo"/>
          <Content style={{ width: "100%", maxWidth: "400px" }}>{children}</Content>
          <Text style={{ fontSize: "14px", color: "grey" }}>© 2025 - Bản quyền thuộc về <b style={{ color: "#1890ff" }}>L-Edu</b>.</Text>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;
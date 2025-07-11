import { ArrowUpOutlined } from "@ant-design/icons";
import { BackTop, Layout } from "antd";
import React from "react";
import Footer from "../components/layout/home/Footer";
import Header from "../components/layout/home/Header";
import { COLORS, RADIUS, SPACING } from "../constants/colors";

const { Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout style={styles.layout}>
      <Header />
      <Content style={styles.content}>{children}</Content>
      <div style={styles.divider} />
      <Footer />
      <BackTop style={styles.backTop}>
        <ArrowUpOutlined />
      </BackTop>
    </Layout>
  );
};

const styles: {
    layout: React.CSSProperties;
    content: React.CSSProperties;
    divider: React.CSSProperties;
    backTop: React.CSSProperties;
} = {
    layout: {
        minHeight: "100vh",
        background: COLORS.background.primary,
        position: "relative",
        overflow: "hidden",
    },
    content: {
        padding: "0",
        background: "transparent",
        minHeight: "80vh",
        marginTop: "64px",
    },
    divider: {
        height: "1px",
        background: COLORS.border.light,
        margin: `${SPACING.xl} 0`,
        position: "relative",
        overflow: "hidden",
    },
    backTop: {
        background: COLORS.background.elevated,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.lg,
        color: COLORS.primary[500],
    },
};

export default MainLayout;
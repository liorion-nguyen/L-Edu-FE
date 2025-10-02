import { ArrowUpOutlined } from "@ant-design/icons";
import { BackTop, Layout } from "antd";
import React, { useState, useEffect } from "react";
import Footer from "../components/layout/home/Footer";
import Header from "../components/layout/home/Header";
import GlobalChatbot from "../components/chatbot/GlobalChatbot";
import { COLORS, RADIUS, SPACING } from "../constants/colors";

const { Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Hiển thị button khi cuộn xuống hơn 300px
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Xóa timeout cũ nếu có
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Tạo timeout mới để ẩn button sau 3 giây không cuộn
      const newTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      setScrollTimeout(newTimeout);
    };

    // Thêm event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <Layout style={styles.layout}>
      <Header />
      <Content style={styles.content}>{children}</Content>
      <div style={styles.divider} />
      <Footer />
      <BackTop 
        style={{
          ...styles.backTop,
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? 'visible' : 'hidden',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <ArrowUpOutlined />
      </BackTop>
      <GlobalChatbot />
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
        overflow: "visible",
    },
    content: {
        padding: "0",
        background: "transparent",
        minHeight: "80vh",
        marginTop: "64px",
        position: "relative",
        zIndex: 1,
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
    },
};

export default MainLayout;
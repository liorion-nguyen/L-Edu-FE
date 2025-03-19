import React, { CSSProperties } from "react";
import { FloatButton, Layout } from "antd";
import Header from "../components/layout/home/Header";
import Footer from "../components/layout/home/Footer";
import ChatPopup from "../components/chatbox/ChatPopup";
import { Helmet } from "react-helmet-async";

const { Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    style?: React.CSSProperties;
    icon?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = "L EDU", style, icon = "/logo_icon.png"  }) => {
    return (
        <Layout style={{ ...styles.layout, ...style }}>
            <Helmet>
                <title>{title}</title>
                <link rel="icon" href={icon} />
            </Helmet>
            <Header />
            <Content style={styles.content}>
                {children}
            </Content>
            <FloatButton.BackTop style={styles.backTop} />
            <div style={styles.divider} />
            <Footer />
            <ChatPopup />
        </Layout>
    );
};

export default MainLayout;

const styles: {
    layout: CSSProperties;
    content: CSSProperties;
    divider: CSSProperties;
    backTop: CSSProperties;
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
    content: {
        padding: "0",
        background: "transparent", // Let the layout background show through
        minHeight: "80vh",
        marginTop: "64px", // Space for the fixed header
    },
    divider: {
        height: "4px",
        background: "linear-gradient(90deg, transparent, #4ECDC4, transparent)", // Teal gradient for divider
        boxShadow: "0 0 15px rgba(78, 205, 196, 0.5)", // Glowing teal shadow
        margin: "40px 0",
        position: "relative",
        overflow: "hidden",
    },
    backTop: {
        background: "rgba(78, 205, 196, 0.1)", // Teal undertone for glassmorphism
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        transition: "box-shadow 0.3s, transform 0.3s",
    },
};

// Add a subtle animation to the divider and hover effects using CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  .divider::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.7), transparent);
    animation: glow 3s infinite;
  }
  @keyframes glow {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: -100%;
    }
  }
  .ant-floatbutton-back-top:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: scale(1.1);
  }
  .chat-popup:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);
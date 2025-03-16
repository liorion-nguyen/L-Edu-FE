import React from "react";
import { FloatButton, Layout } from "antd";
import Header from "../components/layout/home/Header";
import Footer from "../components/layout/home/Footer";
import ChatPopup from "../components/chatbox/ChatPopup";

const { Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Layout style={{ minHeight: "100vh", background: "white" }}>
            <Header />
            <Content style={{ minHeight: "80vh", marginTop: "64px" }}>
                {children}
            </Content>
            <FloatButton.BackTop />
            <Footer />
            <ChatPopup />
        </Layout>
    );
};

export default MainLayout;
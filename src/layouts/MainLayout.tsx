import React from "react";
import { Layout } from "antd";
import Header from "../components/layout/home/Header";
import Footer from "../components/layout/home/Footer";

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
            <Footer />
        </Layout>
    );
};

export default MainLayout;
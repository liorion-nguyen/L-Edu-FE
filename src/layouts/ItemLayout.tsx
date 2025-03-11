import { Layout } from "antd";
import React from "react";
import { Helmet } from "react-helmet-async";

const { Content } = Layout;

interface ItemLayoutProps {
    children: React.ReactNode;
    bg?: string;
    style?: React.CSSProperties;
    title?: string;
    icon?: string;
}

const ItemLayout: React.FC<ItemLayoutProps> = ({ children, bg = "#ffffff", title = "L EDU", icon = "/images/icons/common/logo.png" }) => {
    return (
        <Layout style={{ background: bg }}>
            <Helmet>
                <title>{title}</title>
                <link rel="icon" href={icon} />
            </Helmet>
            <Content style={{ padding: "30px" }}>
                {children}
            </Content>
        </Layout>
    );
};

export default ItemLayout;
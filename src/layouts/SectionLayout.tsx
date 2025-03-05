import React from "react";
import { Grid, Layout } from "antd";
import { Helmet } from "react-helmet-async";

const { Content } = Layout;

interface SectionLayoutProps {
    children: React.ReactNode;
    bg?: string;
    style?: React.CSSProperties;
    title?: string;
    icon?: string;
}
const { useBreakpoint } = Grid;

const SectionLayout: React.FC<SectionLayoutProps> = ({ children, bg = "#ffffff", style, title = "L EDU", icon = "/images/icons/common/logo.png" }) => {
    const screens = useBreakpoint();
    const paddingValue = screens.xl ? "0 200px" :
        screens.lg ? "0 100px" :
            "0 20px";
    return (
        <Layout style={{ background: bg }}>
            <Helmet>
                <title>{title}</title>
                <link rel="icon" href={icon} />
            </Helmet>
            <Content style={{ padding: paddingValue }}>
                {children}
            </Content>
        </Layout>
    );
};

export default SectionLayout;
import React from "react";
import { Grid, Layout } from "antd";
import { Helmet } from "react-helmet-async";
import { CODELAB_BRAND_NAME, CODELAB_IMG } from "../constants/codelabSite";

const { Content } = Layout;

interface SectionLayoutProps {
    children: React.ReactNode;
    bg?: string;
    style?: React.CSSProperties;
    title?: string;
    icon?: string;
}
const { useBreakpoint } = Grid;

const SectionLayout: React.FC<SectionLayoutProps> = ({ children, style, title = CODELAB_BRAND_NAME, icon = CODELAB_IMG.logoIcon }) => {
    const screens = useBreakpoint();
    const paddingValue = screens.xl ? "0 200px" :
        screens.lg ? "0 100px" :
            "0 20px";
    return (
        <Layout style={style}>
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
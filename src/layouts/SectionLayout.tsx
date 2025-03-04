import React from "react";
import { Grid, Layout } from "antd";

const { Content } = Layout;

interface SectionLayoutProps {
    children: React.ReactNode;
    bg?: string;
    style?: React.CSSProperties;
}
const { useBreakpoint } = Grid;

const SectionLayout: React.FC<SectionLayoutProps> = ({ children, bg = "#ffffff", style }) => {
    const screens = useBreakpoint(); 
    const paddingValue = screens.xl ? "0 200px" : 
                         screens.lg ? "0 100px" : 
                         "0 20px";
    return (
        <Layout style={{ background: bg }}>
            <Content style={{ padding: paddingValue }}>
                {children}
            </Content>
        </Layout>
    );
};

export default SectionLayout;
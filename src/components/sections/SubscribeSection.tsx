import { Button, Col, Grid, Input, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { SendOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const SubscribeSection = () => {
    const screens = useBreakpoint();
    const getPadding = () => {
        if (screens.lg) return "50px 25%";
        if (screens.md) return "50px 10%";
        if (screens.sm) return "50px 5%";
        return "50px 0"; 
      };
    return (
        <SectionLayout>
            <Row style={{ ...styles.container, padding: getPadding() }} justify="center" align="middle" gutter={[0, 20]}>
                <Title level={2} style={{ textAlign: "center", color: "#ffffff" }}>
                    If you interest our course and know our latest news Please subscribe our newsletter
                </Title>
                <Col span={24}>
                    <div style={styles.form}>
                        <Input placeholder="Enter your email" style={styles.input} />
                        <Button style={styles.button} icon={screens.md ? undefined : <SendOutlined />}>
                            {screens.md ? "Subscribe" : ""}
                        </Button>
                    </div>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default SubscribeSection;

const styles = {
    container: {
        background: "#6259E8",
        borderRadius: "30px"
    },
    form: {
        border: 0,
        borderRadius: "20px",
        padding: "10px 20px",
        background: "#ffffff",
        width: '100%',
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    input: {
        border: "none",
        outline: "none",
        fontSize: "16px",
        flex: 1
    },
    button: {
        background: "#6259E8",
        border: 0,
        fontSize: "16px"
    }
}
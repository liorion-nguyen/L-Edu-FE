import { Avatar, Col, Image, Row, theme, Typography } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";

const { Text } = Typography;

const ImageHero = ({ path, alt }: { path: string; alt: string; }) => {
    const styles = useStyles();
    return <Image src={path} alt={alt} style={styles.img} />;
};

const Hero = () => {
    const styles = useStyles();
    return (
        <SectionLayout bg="#6259E8">
            <Title level={1} style={styles.title}>Advance Your Career with Our Online Courses</Title>
            <Row justify="space-between" align="bottom" gutter={30} style={{ paddingBottom: "50px" }}>
                <Col lg={10} md={10} sm={24} xs={24}>
                    <ImageHero path="/images/landing/sections/hero/hero1.png" alt="hero1" />
                </Col>
                <Col lg={14} md={14} sm={24} xs={24}>
                    <Row justify="end">
                        <Text style={styles.subtitle}>Our courses cover a range of topics, including accounting, finance, marketing, human resources, and more. You'll have access to expert instructors</Text>
                    </Row>
                    <Row gutter={30} align="bottom">
                        <Col lg={14} md={14} sm={24} xs={24}>
                            <ImageHero path="/images/landing/sections/hero/hero2.png" alt="hero2" />
                        </Col>
                        <Col lg={10} md={10} sm={24} xs={24}>
                            <Row justify="center" align="middle" style={{ flexDirection: "column", textAlign: "center" }}>
                                <Col>
                                    <Avatar.Group>
                                        <Avatar src="/images/landing/sections/hero/avatar1.png" style={styles.avatar} size={40} />
                                        <Avatar src="/images/landing/sections/hero/avatar1.png" style={styles.avatar} size={40} />
                                        <Avatar src="/images/landing/sections/hero/avatar1.png" style={styles.avatar} size={40} />
                                    </Avatar.Group>
                                    <p style={styles.textCountEnrolled}>200k Enrolled Students</p>
                                </Col>
                                <ImageHero path="/images/landing/sections/hero/hero3.png" alt="hero3" />
                            </Row>
                        </Col>

                    </Row>
                </Col>
            </Row>
        </SectionLayout>
    );
}

export default Hero;

const useStyles = () => {
    const { token } = theme.useToken();
    return {
        title: {
            fontSize: "4.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "right" as React.CSSProperties["textAlign"],
            color: token.colorPrimary,
        },
        subtitle: {
            display: "block",
            fontSize: "1.2rem",
            marginBottom: "20px",
            color: token.colorTextSecondary,
            width: "70%",
        },
        button: {
            padding: "10px 20px",
            backgroundColor: token.colorBgContainer,
            color: token.colorTextBase,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "5px",
            cursor: "pointer",
            border: `1px solid ${token.colorBorder}`,
        },
        buttonHover: {
            backgroundColor: token.colorPrimary,
            color: "white",
        },
        img: {
            borderRadius: "10px",
            width: "100%",
        },
        avatar: {
            border: `1px solid #fff`,
        },
        textCountEnrolled: {
            width: "fit-content",
            color: token.colorTextSecondary,
        }
    };
};
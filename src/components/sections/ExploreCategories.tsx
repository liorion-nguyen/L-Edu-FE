import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { Typography } from "antd";
import SectionLayout from "../../layouts/SectionLayout";

const Text = Typography.Text;

const ExploreCategories = () => {
    const categories = [
        {
            name: "React Native",
            lesson: 20,
            icon: "/images/landing/sections/categories/react&react-native.png",
            handle: () => { }
        },
        {
            name: "React",
            lesson: 20,
            icon: "/images/landing/sections/categories/react&react-native.png",
            handle: () => { }
        },
        {
            name: "Website Basic",
            lesson: 20,
            icon: "/images/landing/sections/categories/web-basic.png",
            handle: () => { }
        },
        {
            name: "Web Developer",
            lesson: 42,
            icon: "/images/landing/sections/categories/web-developer.png",
            handle: () => { }
        },
        {
            name: "App Producer",
            lesson: 42,
            icon: "/images/landing/sections/categories/app-producer.png",
            handle: () => { }
        },
        {
            name: "Computer Science",
            lesson: 42,
            icon: "/images/landing/sections/categories/computer-science.png",
            handle: () => { }
        },
        {
            name: "Codementum",
            lesson: 10,
            icon: "/images/landing/sections/categories/codementum.png",
            handle: () => { }
        },
        {
            name: "Data Science",
            lesson: 10,
            icon: "/images/landing/sections/categories/data-science.png",
            handle: () => { }
        },
        {
            name: "Javascript Basic",
            lesson: 20,
            icon: "/images/landing/sections/categories/javascript-basic.png",
            handle: () => { }
        },
    ];

    return (
        <SectionLayout>
            <Row justify="center">
                <Col span={24} style={{ paddingBottom: "20px" }}>
                    <Title level={2} style={{ textAlign: "center", color: "#282846" }}>Explore Our Categories</Title>
                </Col>
                <Col span={24}>
                    <Row gutter={[20, 20]}>
                        {categories.map((category, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                <Row gutter={[10, 10]} justify="space-between" align="middle" style={{ border: "1px solid #8B8A9D", borderRadius: "50px", padding: "10px 20px" }}>
                                    <Col style={{ width: "60px", height: "50px" }}>
                                        <img src={category.icon} alt={category.name} style={{ width: "100%", height: "100%" }} />
                                    </Col>
                                    <Col flex="auto">
                                        <Title level={4} style={{ marginTop: 0, width: "fit-content", color: "#282846" }}>{category.name}</Title>
                                        <Text style={{ color: "#666666", fontSize: '16px' }}>{category.lesson} lessons</Text>
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default ExploreCategories;
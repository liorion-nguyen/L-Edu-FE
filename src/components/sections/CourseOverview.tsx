import { Button, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { CheckOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Text } = Typography;

const CourseOverview = () => {
    const reviews = [
        "This course and was amazed by how much I learned",
        "The instructors were knowledgeable and engaging"
    ]
    return (
        <SectionLayout bg="#BFECFF">
            <Row gutter={{ xs: 20, sm: 40, md: 80, lg: 120, xl: 160, xxl: 200 }}  align="bottom" justify="center">
                <Col md={24} lg={24} xl={9} style={{ textAlign: 'center' }}>
                    <img src="/images/landing/sections/categories/course-overview.png" alt="Course Overview" style={{ maxWidth: "100vw" }} />
                </Col>
                <Col md={24} lg={24} xl={15} style={{ paddingBottom: '30px' }}>
                    <Row gutter={[10, 10]}>
                        <Col span={24}>
                            <Title level={2} style={{ color: "#6259E8" }}>Our courses cover a range of topics, including accounting, finance, and more</Title>
                        </Col>
                        <Col span={24}>
                            <Text style={{ color: "#333", fontSize: '17px' }}>You'll have access to expert instructors and comprehensive course materials, as well as the opportunity to work on real- world projects and assignments.</Text>
                        </Col>
                        <Col span={24}>
                            {
                                reviews.map((review, index) => (
                                    <Row key={index} gutter={[10, 10]}>
                                        <Col>
                                            <CheckOutlined style={{ background: "#6259E8", borderRadius: '50%', padding: '3px' }}/>
                                        </Col>
                                        <Col>
                                            <Text style={{ color: "#333", fontSize: '15px' }}>{review}</Text>
                                        </Col>
                                    </Row>
                                ))
                            }
                        </Col>
                        <Col span={24}>
                            <Button style={{ background: "#6259E8" }}>Read more</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default CourseOverview;
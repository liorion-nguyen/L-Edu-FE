import { Card, Carousel, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";

const OurMentor = () => {
    const mentors = [
        {
            name: "John Doe",
            title: "Mentor for React Native",
            image: "/images/landing/sections/fakeImages/mentor1.png",
            handle: () => { }
        },
        {
            name: "Wade Warren",
            title: "Mentor for React",
            image: "/images/landing/sections/fakeImages/mentor1.png",
            handle: () => { }
        },
        {
            name: "Darrell Steward",
            title: "Menor for Website Basic",
            image: "/images/landing/sections/fakeImages/mentor1.png",
            handle: () => { }
        },
        {
            name: "Jeennie Kim",
            title: "Mentor for Web Developer",
            image: "/images/landing/sections/fakeImages/mentor1.png",
            handle: () => { }
        },
        {
            name: "Jane Doe",
            title: "Mentor for App Producer",
            image: "/images/landing/sections/fakeImages/mentor1.png",
            handle: () => { }
        }
    ];
    return (
        <SectionLayout>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Title level={2} style={{ textAlign: "center", color: "#282846" }}>Our Courses Mentors</Title>
                </Col>
                <Col span={24}>
                    <Carousel dots={false} autoplay slidesToShow={4} responsive={[
                        { breakpoint: 1024, settings: { slidesToShow: 2 } },
                        { breakpoint: 768, settings: { slidesToShow: 1 } }
                    ]}>
                        {mentors.map((mentor, index) => (
                            <Col>
                                <Card key={index} style={{ paddingTop: "10px", margin: "10px", overflow: "visible", border: 0, boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)" }} cover={<img src={mentor.image} alt={mentor.name} style={{ height: 200, width: "-webkit-fill-available", objectFit: "cover", margin: '10px 20px' }} />}>
                                    <Card.Meta style={{ textAlign: "center" }} title={mentor.name} description={mentor.title} />
                                </Card>
                            </Col>
                        ))}
                    </Carousel>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default OurMentor;
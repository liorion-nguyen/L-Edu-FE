import { Card, Carousel, Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";

const OurMentor = () => {
    const mentors = [
        {
            name: "Nguyễn Thanh Tùng",
            title: "Mentor về React Native",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960362.png",
            handle: () => { }
        },
        {
            name: "Trần Minh Đức",
            title: "Mentor về React",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960363.png",
            handle: () => { }
        },
        {
            name: "Lê Thị Hồng Nhung",
            title: "Mentor về Lập trình Web cơ bản",
            image: "https://img.pikbest.com/png-images/qiantu/original-cute-cartoon-teacher-classroom-hand-drawn-free-buckle-element_2732027.png!sw800",
            handle: () => { }
        },
        {
            name: "Phạm Gia Bảo",
            title: "Mentor về Phát triển Web",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960364.png",
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
                            <Col key={index}>
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
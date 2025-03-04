import { Button, Col, Row, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Text = Typography.Text;

const OurBlog = () => {
    const blogs = [
        {
            title: "Lorem Ipsum",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas tincidunt. Nullam nec nunc nec libero ultricies ultricies.",
            image: "/images/landing/sections/fakeImages/blog.png",
        },
        {
            title: "Lorem Ipsum",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas tincidunt. Nullam nec nunc nec libero ultricies ultricies.",
            image: "/images/landing/sections/fakeImages/blog.png",
        }
    ];
    return (
        <SectionLayout>
            <Row justify="center" gutter={[20, 20]}>
                <Col lg={8} md={12} sm={24} xs={24}>
                    <Row justify="start" gutter={[20, 10]}>
                        <Col span={24}>
                            <Text>Our Blog Post</Text>
                        </Col>
                        <Col span={24}>
                            <Title level={2}>Latest Post from Blog</Title>
                        </Col>
                        <Col span={24}>
                            <Text>Turpis viverra pallentesque diam in. Eu elementum commodo faciisis massa senectus.</Text>
                        </Col>
                        <Col span={24}>
                        <Space size="small">
                            <Button type="primary" shape="circle" icon={<LeftOutlined />} size="large" />
                            <Button type="primary" shape="circle" icon={<RightOutlined />} size="large" />
                        </Space>
                        </Col>
                    </Row>
                </Col>
                <Col lg={16} md={12} sm={24} xs={24}>
                    <Row justify="center" gutter={[20, 20]}>
                        {
                            blogs.map((blog, index) => (
                                <Col key={index} lg={12} md={24}>
                                    <img src={blog.image} alt={blog.title} style={styles.img} />
                                    <Title level={4}>{blog.title}</Title>
                                    <Text style={styles.text}>{blog.description}</Text>
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default OurBlog;


const styles = {
    img: {
        borderRadius: "10px",
        width: "100%",
    },
    text: {
        fontSize: '15px',
        color: "#666666"
    }
}
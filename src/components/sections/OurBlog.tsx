import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { COLORS } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";

const { Text } = Typography;

const OurBlog = () => {
  const blogs = [
    {
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas tincidunt. Nullam nec nunc nec libero ultricies ultricies.",
      image: "/images/landing/sections/fakeImages/blog.png",
    },
    {
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas tincidunt. Nullam nec nunc nec libero ultricies ultricies.",
      image: "/images/landing/sections/fakeImages/blog.png",
    },
  ];

  return (
    <SectionLayout style={styles.section}>
      <Row justify="center" gutter={[20, 20]}>
        {/* Blog Info Section */}
        <Col lg={8} md={12} sm={24} xs={24}>
          <Row justify="start" gutter={[20, 10]}>
            <Col span={24}>
              <Text style={styles.subTitle}>Our Blog Post</Text>
            </Col>
            <Col span={24}>
              <Title level={2} style={styles.title}>
                Latest Post from Blog
              </Title>
            </Col>
            <Col span={24}>
              <Text style={styles.description}>
                Turpis viverra pallentesque diam in. Eu elementum commodo faciisis massa senectus.
              </Text>
            </Col>
            <Col span={24}>
              <Space size="small">
                <Button
                  shape="circle"
                  icon={<LeftOutlined />}
                  size="large"
                  style={styles.navButton}
                />
                <Button
                  shape="circle"
                  icon={<RightOutlined />}
                  size="large"
                  style={styles.navButton}
                />
              </Space>
            </Col>
          </Row>
        </Col>

        {/* Blog Cards Section */}
        <Col lg={16} md={12} sm={24} xs={24}>
          <Row justify="center" gutter={[20, 20]}>
            {blogs.map((blog, index) => (
              <Col key={index} lg={12} md={24}>
                <div style={styles.card}>
                  <img src={blog.image} alt={blog.title} style={styles.img} />
                  <Title level={4} style={styles.cardTitle}>
                    {blog.title}
                  </Title>
                  <Text style={styles.cardDescription}>{blog.description}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default OurBlog;

const styles: {
  section: CSSProperties;
  subTitle: CSSProperties;
  title: CSSProperties;
  description: CSSProperties;
  navButton: CSSProperties;
  card: CSSProperties;
  img: CSSProperties;
  cardTitle: CSSProperties;
  cardDescription: CSSProperties;
} = {
  section: {
    background: COLORS.background.secondary,
    padding: "50px 0",
  },
  subTitle: {
    color: COLORS.accent[600],
    fontSize: "16px",
    fontWeight: 500,
  },
  title: {
    color: COLORS.text.heading,
    fontSize: "28px",
    fontWeight: 600,
  },
  description: {
    color: COLORS.text.secondary,
    fontSize: "15px",
    lineHeight: "1.6",
  },
  navButton: {
    background: COLORS.background.primary,
    border: `1px solid ${COLORS.border.light}`,
    color: COLORS.text.primary,
  },
  card: {
    background: COLORS.background.primary,
    border: `1px solid ${COLORS.border.light}`,
    borderRadius: "12px",
    padding: "20px",
  },
  img: {
    borderRadius: "8px",
    width: "100%",
  },
  cardTitle: {
    color: COLORS.text.heading,
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: 600,
  },
  cardDescription: {
    color: COLORS.text.primary,
    fontSize: "15px",
    lineHeight: "1.6",
  },
};
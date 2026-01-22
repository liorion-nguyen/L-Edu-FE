import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import SectionLayout from "../../layouts/SectionLayout";

const { Text } = Typography;

const OurBlog = () => {
  const { t } = useTranslationWithRerender();
  
  const blogs = [
    {
      title: t('blog.post1.title'),
      description: t('blog.post1.description'),
      image: "/images/landing/sections/fakeImages/blog.png",
    },
    {
      title: t('blog.post2.title'),
      description: t('blog.post2.description'),
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
              <Text style={styles.subTitle}>{t('blog.subtitle')}</Text>
            </Col>
            <Col span={24}>
              <Title level={2} style={styles.title}>
                {t('blog.title')}
              </Title>
            </Col>
            <Col span={24}>
              <Text style={styles.description}>
                {t('blog.description')}
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
    background: "var(--bg-secondary)",
    padding: "50px 0",
  },
  subTitle: {
    color: "var(--accent-color)",
    fontSize: "16px",
    fontWeight: 500,
  },
  title: {
    color: "var(--text-primary)",
    fontSize: "28px",
    fontWeight: 600,
  },
  description: {
    color: "var(--text-secondary)",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  navButton: {
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  },
  card: {
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "20px",
  },
  img: {
    borderRadius: "8px",
    width: "100%",
  },
  cardTitle: {
    color: "var(--text-primary)",
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: 600,
  },
  cardDescription: {
    color: "var(--text-primary)",
    fontSize: "15px",
    lineHeight: "1.6",
  },
};
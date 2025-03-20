import { Button, Col, Row, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";

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
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    padding: "50px 0",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  subTitle: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "16px",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  title: {
    color: "#B0E0E6", // Pale teal for text
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  description: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "15px",
  },
  navButton: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    color: "#B0E0E6", // Pale teal for icons
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
  card: {
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    borderRadius: 16,
    padding: 20,
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  img: {
    borderRadius: "10px",
    width: "100%",
    filter: "drop-shadow(0 0 5px rgba(78, 205, 196, 0.3))", // Teal glow
  },
  cardTitle: {
    color: "#B0E0E6", // Pale teal for text
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    marginTop: 10,
  },
  cardDescription: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "15px",
  },
};

// Add hover effects and animations using CSS
const styleSheetOurBlog = document.createElement("style");
styleSheetOurBlog.innerText = `
  .blog-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-5px);
  }
  .nav-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetOurBlog);
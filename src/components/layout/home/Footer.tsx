import { Col, Layout, Row, Space, Typography } from "antd";
import { CSSProperties } from "react";
import { COLORS } from "../../../constants/colors";
import SectionLayout from "../../../layouts/SectionLayout";

const { Title, Text } = Typography;

const Footer = () => {
  const socials = [
    { name: "Facebook", icon: "/images/icons/socials/ft_facebook.png", link: "#" },
    { name: "Twitter", icon: "/images/icons/socials/ft_twitter.png", link: "#" },
    { name: "Pinterest", icon: "/images/icons/socials/ft_pinterest.png", link: "#" },
    { name: "Linkedin", icon: "/images/icons/socials/ft_linkedin.png", link: "#" },
  ];

  const contacts = [
    { name: "Location", value: "2972 Westheimer Rd. Santa Ana, Illinois 85486", icon: "/images/icons/contacts/location.png" },
    { name: "Email", value: "educare31@gmail.com", icon: "/images/icons/contacts/email.png" },
    { name: "Phone", value: "(704) 555-0127", icon: "/images/icons/contacts/phone.png" },
  ];

  const companyLinks = ["Courses", "Feature", "Design"];
  const courseLinks = ["Language", "Marketing", "Testimonial", "Developer"];

  return (
    <Layout.Footer style={styles.footer}>
      <SectionLayout style={styles.sectionLayout}>
        <Row gutter={[32, 32]} justify="space-between" style={{ padding: "30px 0" }}>
          {/* Logo & Socials */}
          <Col lg={6} md={12} sm={24} xs={24} style={styles.center}>
            <Title level={3} style={styles.logo}>
              L-Edu
            </Title>
            <Text style={styles.text}>Nền tảng học lập trình toàn diện</Text>
            <Space size="middle">
              {socials.map((social, index) => (
                <a key={index} href={social.link} style={styles.socialLink}>
                  <img src={social.icon} alt={social.name} style={styles.icon} />
                </a>
              ))}
            </Space>
          </Col>

          {/* Company Section */}
          <Col lg={4} md={8} sm={12} xs={24} style={styles.center}>
            <Title level={4} style={styles.title}>
              Company
            </Title>
            <ul style={styles.list}>
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" style={styles.link}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Course Section */}
          <Col lg={4} md={8} sm={12} xs={24} style={styles.center}>
            <Title level={4} style={styles.title}>
              Course
            </Title>
            <ul style={styles.list}>
              {courseLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" style={styles.link}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Contact Information */}
          <Col lg={6} md={12} sm={24} xs={24} style={styles.center}>
            <Title level={4} style={styles.title}>
              Contact Information
            </Title>
            <ul style={styles.list}>
              {contacts.map((contact, index) => (
                <li key={index} style={styles.contactItem}>
                  <img src={contact.icon} alt={contact.name} style={styles.contactIcon} />
                  <Text style={styles.contactText}>{contact.value}</Text>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </SectionLayout>
    </Layout.Footer>
  );
};

export default Footer;

const styles: {
  footer: CSSProperties;
  sectionLayout: CSSProperties;
  center: CSSProperties;
  logo: CSSProperties;
  title: CSSProperties;
  list: CSSProperties;
  text: CSSProperties;
  icon: CSSProperties;
  socialLink: CSSProperties;
  link: CSSProperties;
  contactItem: CSSProperties;
  contactIcon: CSSProperties;
  contactText: CSSProperties;
} = {
  footer: {
    textAlign: "center",
    padding: 0,
    background: "transparent",
  },
  sectionLayout: {
    background: COLORS.background.tertiary,
    padding: "0",
    position: "relative",
    overflow: "hidden",
  },
  center: {
    textAlign: "center",
  },
  logo: {
    fontWeight: 700,
    color: COLORS.text.heading,
    marginBottom: "20px",
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
    color: COLORS.text.heading,
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    fontSize: "16px",
  },
  text: {
    color: COLORS.text.secondary,
    fontSize: "16px",
    display: "block",
    marginBottom: "20px",
  },
  icon: {
    width: "24px",
    height: "24px",
  },
  socialLink: {
    display: "inline-block",
  },
  link: {
    color: COLORS.text.secondary,
    textDecoration: "none",
    display: "block",
    marginBottom: "10px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
    background: COLORS.background.primary,
    borderRadius: "8px",
    padding: "10px",
    border: `1px solid ${COLORS.border.light}`,
  },
  contactIcon: {
    width: "20px",
    marginRight: "10px",
  },
  contactText: {
    color: COLORS.text.primary,
    fontSize: "14px",
  },
};
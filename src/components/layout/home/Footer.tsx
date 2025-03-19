import { Col, Layout, Row, Space, Typography } from "antd";
import { CSSProperties } from "react";
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
              Educare
            </Title>
            <Text style={styles.text}>In tincidunt maecenas tellus</Text>
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
    background: "transparent", // Let SectionLayout handle the background
  },
  sectionLayout: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    padding: "0",
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  center: {
    textAlign: "center",
  },
  logo: {
    fontWeight: "bold",
    color: "#B0E0E6", // Pale teal for logo
    textShadow: "0 0 10px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    marginBottom: "20px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#B0E0E6", // Pale teal for titles
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    fontSize: "16px",
  },
  text: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "16px",
    display: "block",
    marginBottom: "20px",
  },
  icon: {
    width: "24px",
    height: "24px",
    filter: "brightness(0.7)",
    transition: "filter 0.3s, transform 0.3s",
  },
  socialLink: {
    display: "inline-block",
    transition: "transform 0.3s",
  },
  link: {
    color: "#B0E0E6", // Pale teal for links
    textDecoration: "none",
    transition: "color 0.3s",
    display: "block",
    marginBottom: "10px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    padding: "10px",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  contactIcon: {
    width: "20px",
    marginRight: "10px",
    filter: "brightness(0.7) hue-rotate(180deg)", // Adjust icon color to match teal theme
    transition: "filter 0.3s",
  },
  contactText: {
    color: "#B0E0E6", // Pale teal for contact text
    fontSize: "16px",
  },
};

// Add hover effects using CSS
const styleSheetFooter = document.createElement("style");
styleSheetFooter.innerText = `
  .footer-social-link:hover img {
    filter: brightness(1);
    transform: scale(1.2);
  }
  .footer-social-link:hover {
    transform: scale(1.1);
  }
  .footer-link:hover {
    color: #4ECDC4;
  }
  .footer-contact-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .footer-contact-item:hover img {
    filter: brightness(1) hue-rotate(180deg);
  }
`;
document.head.appendChild(styleSheetFooter);
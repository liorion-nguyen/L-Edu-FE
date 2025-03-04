import { Col, Layout, Row, Space, Typography } from "antd";
import { CSSProperties } from "react";
import SectionLayout from "../../layouts/SectionLayout";

const { Title, Text } = Typography;

const Footer = () => {
    const socials = [
        { name: "Facebook", icon: "/images/icons/socials/ft_facebook.png", link: "#" },
        { name: "Twitter", icon: "/images/icons/socials/ft_twitter.png", link: "#" },
        { name: "Pinterest", icon: "/images/icons/socials/ft_pinterest.png", link: "#" },
        { name: "Linkedin", icon: "/images/icons/socials/ft_linkedin.png", link: "#" }
    ];

    const contacts = [
        { name: "Location", value: "2972 Westheimer Rd. Santa Ana, Illinois 85486", icon: "/images/icons/contacts/location.png" },
        { name: "Email", value: "educare31@gmail.com", icon: "/images/icons/contacts/email.png" },
        { name: "Phone", value: "(704) 555-0127", icon: "/images/icons/contacts/phone.png" }
    ];

    return (
        <Layout.Footer style={styles.footer}>
            <SectionLayout bg="#282846">
                <Row gutter={[32, 32]} justify="space-between" style={{ padding: "50px 0" }}>
                    
                    {/* Logo & Socials */}
                    <Col lg={6} md={12} sm={24} xs={24} style={styles.center}>
                        <Title level={3} style={styles.logo}>Educare</Title>
                        <Text style={styles.text}>In tincidunt maecenas tellus</Text>
                        <Space size="middle">
                            {socials.map((social, index) => (
                                <a key={index} href={social.link}>
                                    <img src={social.icon} alt={social.name} style={styles.icon} />
                                </a>
                            ))}
                        </Space>
                    </Col>

                    {/* Company Section */}
                    <Col lg={4} md={8} sm={12} xs={24} style={styles.center}>
                        <Title level={4} style={styles.title}>Company</Title>
                        <ul style={styles.list}>
                            <li>Courses</li>
                            <li>Feature</li>
                            <li>Design</li>
                        </ul>
                    </Col>

                    {/* Course Section */}
                    <Col lg={4} md={8} sm={12} xs={24} style={styles.center}>
                        <Title level={4} style={styles.title}>Course</Title>
                        <ul style={styles.list}>
                            <li>Language</li>
                            <li>Marketing</li>
                            <li>Testiminal</li>
                            <li>Developer</li>
                        </ul>
                    </Col>

                    {/* Contact Information */}
                    <Col lg={6} md={12} sm={24} xs={24} style={styles.center}>
                        <Title level={4} style={styles.title}>Contact Information</Title>
                        <ul style={styles.list}>
                            {contacts.map((contact, index) => (
                                <li key={index} style={styles.contactItem}>
                                    <img src={contact.icon} alt={contact.name} style={styles.contactIcon} />
                                    {contact.value}
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
    center: CSSProperties;
    logo: CSSProperties;
    title: CSSProperties;
    list: CSSProperties;
    text: CSSProperties;
    icon: CSSProperties;
    contactItem: CSSProperties;
    contactIcon: CSSProperties;
} = {
    footer: {
        textAlign: "center",
        padding: 0
    },
    center: {
        textAlign: "center"
    },
    logo: {
        fontWeight: "bold",
        color: "#ffffff"
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#ffffff"
    },
    list: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
        color: "#ffffff",
        fontSize: "16px"
    },
    text: {
        color: "#ffffff",
        fontSize: "16px",
        display: "block",
        marginBottom: "10px"
    },
    icon: {
        width: "20px",
        height: "20px"
    },
    contactItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: "16px",
        marginBottom: "10px"
    },
    contactIcon: {
        width: "20px",
        marginRight: "10px"
    }
};

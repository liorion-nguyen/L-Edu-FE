import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import SectionLayout from "../../layouts/SectionLayout";
import { CSSProperties } from "react";

const PartnerNetwork = () => {
  const customers = [
    { name: "Mindx", logo: "/images/landing/sections/overview/mindx.png", link: "https://mindx.edu.vn/" },
    { name: "Kite", logo: "/images/landing/sections/overview/kite.png", link: "http://americanstudy.edu.vn/" },
    { name: "Fetch", logo: "/images/landing/sections/overview/fetch.png", link: "https://www.fetch.tech/" },
    { name: "Starack", logo: "/images/landing/sections/overview/starack.png", link: "https://starack.net/" },
    { name: "Hnue", logo: "/images/landing/sections/overview/hnue.png", link: "https://hnue.edu.vn/" },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Row>
        <Col span={24}>
          <Title level={2} style={styles.title}>
            Partner Network
          </Title>
        </Col>
        <Col span={24}>
          <Row justify="center" style={styles.logoContainer}>
            {customers.map((customer, index) => (
              <a key={index} href={customer.link} target="_blank" rel="noreferrer" style={styles.logoLink}>
                <img src={customer.logo} alt={customer.name} style={styles.logo} />
              </a>
            ))}
          </Row>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default PartnerNetwork;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  logoContainer: CSSProperties;
  logoLink: CSSProperties;
  logo: CSSProperties;
} = {
  sectionLayout: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  title: {
    textAlign: "center",
    color: "#B0E0E6", // Pale teal for title
    textShadow: "0 0 10px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    marginBottom: "40px",
  },
  logoContainer: {
    display: "flex",
    gap: "60px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  logoLink: {
    transition: "transform 0.3s",
  },
  logo: {
    height: "100px",
    filter: "brightness(0.7)",
    transition: "filter 0.3s, transform 0.3s",
  },
};

// Add hover effects using CSS
const styleSheetPartner = document.createElement("style");
styleSheetPartner.innerText = `
  .partner-logo-link:hover img {
    filter: brightness(1);
    transform: scale(1.1);
  }
  .partner-logo-link:hover {
    transform: scale(1.1);
  }
`;
document.head.appendChild(styleSheetPartner);
import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";

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
    background: COLORS.background.secondary,
    position: "relative",
    overflow: "hidden",
    padding: `${SPACING.xl} 0`,
  },
  title: {
    textAlign: "center",
    color: COLORS.text.heading,
    marginBottom: SPACING.xl,
    fontSize: "2.5rem",
    fontWeight: 600,
  },
  logoContainer: {
    display: "flex",
    gap: "60px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  logoLink: {
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    background: COLORS.background.primary,
    border: `1px solid ${COLORS.border.light}`,
  },
  logo: {
    height: "80px",
    filter: "grayscale(0%)",
  },
};
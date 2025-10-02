import { Avatar, Col, Image, Row, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";

const { Text } = Typography;

const ImageHero = ({ path, alt }: { path: string; alt: string }) => {
  return <Image src={path} alt={alt} style={styles.img} />;
};

const Hero = () => {
  const { t } = useTranslationWithRerender();
  
  return (
    <SectionLayout style={styles.sectionLayout}>
      <Title level={1} style={styles.title}>
        {t('hero.title')}
      </Title>
      <Row justify="space-between" align="bottom" gutter={[30, 30]} style={{ paddingBottom: "60px" }}>
        <Col lg={10} md={10} sm={24} xs={24}>
          <ImageHero path="/images/landing/sections/hero/hero1.png" alt="hero1" />
        </Col>
        <Col lg={14} md={14} sm={24} xs={24}>
          <Row justify="end">
            <Text style={styles.subtitle}>
              {t('hero.subtitle')}
            </Text>
          </Row>
          <Row gutter={[30, 30]} align="bottom">
            <Col lg={14} md={14} sm={24} xs={24}>
              <ImageHero path="/images/landing/sections/hero/hero2.png" alt="hero2" />
            </Col>
            <Col lg={10} md={10} sm={24} xs={24}>
              <Row justify="center" align="middle" style={{ flexDirection: "column", textAlign: "center" }}>
                <Col>
                  <Avatar.Group>
                    <Avatar
                      src="https://pngimg.com/uploads/student/student_PNG62560.png"
                      style={styles.avatar}
                      size={40}
                    />
                    <Avatar
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZFKQxbj4IBPdrWQQcdv_c3hWHe-nwjXk6xJs77n11_p0KaE5ZUO2QuF9ge1aECWezbWs&usqp=CAU"
                      style={styles.avatar}
                      size={40}
                    />
                    <Avatar
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-t7aoG_itYbGrEkhCckwclpEfElHkxl1ScA&s"
                      style={styles.avatar}
                      size={40}
                    />
                  </Avatar.Group>
                  <Text style={styles.textCountEnrolled}>200k {t('hero.enrolled')}</Text>
                </Col>
                <ImageHero path="/images/landing/sections/hero/hero3.png" alt="hero3" />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </SectionLayout>
  );
};

export default Hero;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  img: CSSProperties;
  avatar: CSSProperties;
  textCountEnrolled: CSSProperties;
} = {
  sectionLayout: {
    background: "var(--bg-primary)",
    position: "relative",
    overflow: "hidden",
    minHeight: "600px",
    padding: SPACING.xl,
  },
  title: {
    fontSize: "4.5rem",
    fontWeight: "bold",
    marginBottom: SPACING.xl,
    textAlign: "right",
    color: "var(--text-primary)",
  },
  subtitle: {
    display: "block",
    fontSize: "1.2rem",
    marginBottom: SPACING.lg,
    color: "var(--text-secondary)",
    width: "70%",
    lineHeight: "1.8",
  },
  img: {
    borderRadius: RADIUS.xl,
    width: "100%",
    filter: "brightness(1)",
  },
  avatar: {
    border: `2px solid ${COLORS.primary[500]}`,
  },
  textCountEnrolled: {
    width: "fit-content",
    color: "var(--text-primary)",
    fontSize: "16px",
    margin: `${SPACING.sm} 0`,
  },
};
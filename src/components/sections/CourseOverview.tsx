import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { RADIUS, SPACING } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";

const CourseOverview = () => {
  const { t } = useTranslationWithRerender();
  
  const features = [
    {
      title: t('courseOverview.feature1.title'),
      description: t('courseOverview.feature1.description'),
      icon: "👨‍🏫",
    },
    {
      title: t('courseOverview.feature2.title'),
      description: t('courseOverview.feature2.description'),
      icon: "🛠️",
    },
    {
      title: t('courseOverview.feature3.title'),
      description: t('courseOverview.feature3.description'),
      icon: "⏰",
    },
    {
      title: t('courseOverview.feature4.title'),
      description: t('courseOverview.feature4.description'),
      icon: "🏆",
    },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Title level={2} style={styles.title}>
        {t('courseOverview.title')}
      </Title>
      <Row gutter={[32, 32]} justify="center">
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={6}>
            <div style={styles.featureCard}>
              <div style={styles.iconContainer}>
                <span style={styles.icon}>{feature.icon}</span>
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </SectionLayout>
  );
};

export default CourseOverview;

const styles: {
  sectionLayout: CSSProperties;
  title: CSSProperties;
  featureCard: CSSProperties;
  iconContainer: CSSProperties;
  icon: CSSProperties;
  featureTitle: CSSProperties;
  featureDescription: CSSProperties;
} = {
  sectionLayout: {
    background: "var(--bg-secondary)",
    padding: `${SPACING.xl} 0`,
  },
  title: {
    textAlign: "center",
    color: "var(--text-primary)",
    marginBottom: SPACING.xl,
    fontSize: "2.5rem",
    fontWeight: 600,
  },
  featureCard: {
    background: "var(--bg-secondary)",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    textAlign: "center",
    height: "100%",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: "3rem",
    display: "inline-block",
  },
  featureTitle: {
    fontSize: "1.3rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: `${SPACING.md} 0`,
  },
  featureDescription: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    margin: 0,
  },
};
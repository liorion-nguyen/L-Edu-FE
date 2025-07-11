import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties } from "react";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import SectionLayout from "../../layouts/SectionLayout";

const CourseOverview = () => {
  const features = [
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience",
      icon: "👨‍🏫",
    },
    {
      title: "Hands-on Projects",
      description: "Build real-world projects to strengthen your portfolio",
      icon: "🛠️",
    },
    {
      title: "Flexible Learning",
      description: "Study at your own pace with lifetime access to materials",
      icon: "⏰",
    },
    {
      title: "Certificate",
      description: "Get certified upon completion to boost your career",
      icon: "🏆",
    },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Title level={2} style={styles.title}>
        Why Choose Our Courses?
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
    background: COLORS.background.secondary,
    padding: `${SPACING.xl} 0`,
  },
  title: {
    textAlign: "center",
    color: COLORS.text.heading,
    marginBottom: SPACING.xl,
    fontSize: "2.5rem",
    fontWeight: 600,
  },
  featureCard: {
    background: COLORS.background.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    textAlign: "center",
    height: "100%",
    border: `1px solid ${COLORS.border.light}`,
    cursor: "pointer",
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
    color: COLORS.text.heading,
    margin: `${SPACING.md} 0`,
  },
  featureDescription: {
    fontSize: "1rem",
    color: COLORS.text.secondary,
    lineHeight: 1.6,
    margin: 0,
  },
};
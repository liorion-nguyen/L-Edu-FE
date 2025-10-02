import { Col, Row } from "antd";
import SectionLayout from "../../layouts/SectionLayout";
import { Typography } from "antd";
import { formatNumber } from "../../utils/logic";
import { CSSProperties } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";

const { Text } = Typography;

const Statistic = () => {
  const { t } = useTranslationWithRerender();
  
  const statistics = [
    { name: t('statistics.studentsEnrolled'), count: 200100 },
    { name: t('statistics.expertMentors'), count: 253 },
    { name: t('statistics.studentReviews'), count: 500005 },
    { name: t('statistics.success'), count: 180000 },
  ];

  return (
    <SectionLayout style={styles.sectionLayout}>
      <Row style={styles.statContainer} justify="space-between" align="middle">
        {statistics.map((statistic, index) => (
          <Col
            xs={24}
            sm={12}
            md={6}
            lg={6}
            key={index}
            style={styles.statItem}
          >
            <Text style={styles.statCount}>{formatNumber(statistic.count)}</Text>
            <Text style={styles.statName}>{statistic.name}</Text>
          </Col>
        ))}
      </Row>
    </SectionLayout>
  );
};

export default Statistic;

const styles: {
  sectionLayout: CSSProperties;
  statContainer: CSSProperties;
  statItem: CSSProperties;
  statCount: CSSProperties;
  statName: CSSProperties;
} = {
  sectionLayout: {
    background: "var(--bg-secondary)",
    padding: "30px 0",
    position: "relative",
    overflow: "hidden",
  },
  statContainer: {
    padding: "50px 100px",
    background: "var(--bg-primary)",
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    border: "1px solid var(--border-color)",
    boxShadow: "0 8px 24px var(--shadow)",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statCount: {
    color: "#4ECDC4", // Brighter teal for count
    fontSize: "25px",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  statName: {
    color: "#B0E0E6", // Pale teal for name
    fontSize: "17px",
  },
};
import { Col, Row } from "antd";
import SectionLayout from "../../layouts/SectionLayout";
import { Typography } from "antd";
import { formatNumber } from "../../utils/logic";
import { CSSProperties } from "react";

const { Text } = Typography;

const Statistic = () => {
  const statistics = [
    { name: "Students Enrolled", count: 200100 },
    { name: "Expert mentors", count: 253 },
    { name: "Students Review", count: 500005 },
    { name: "Success", count: 180000 },
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
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  statContainer: {
    padding: "50px 100px",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(78, 205, 196, 0.2)", // Teal glow
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
import { Col, Row } from "antd";
import CourseOverview from "../../components/sections/CourseOverview";
import ExploreCategories from "../../components/sections/ExploreCategories";
import Hero from "../../components/sections/Hero";
import OurBlog from "../../components/sections/OurBlog";
import OurMentor from "../../components/sections/OurMentor";
import PartnerNetwork from "../../components/sections/PartnerNetwork";
import Review from "../../components/sections/Reviews";
import Statistic from "../../components/sections/Statistic";
import SubscribeSection from "../../components/sections/SubscribeSection";

const sections = [
  Hero,
  PartnerNetwork,
  ExploreCategories,
  CourseOverview,
  Statistic,
  OurMentor,
  Review,
  OurBlog,
  SubscribeSection,
];

const LandingPage = () => {
  return (
    <Row gutter={[0, 80]} justify="center" style={{ marginBottom: "30px" }}>
      {sections.map((Section, index) => (
        <Col key={index} span={24}>
          <Section />
        </Col>
      ))}
    </Row>
  );
};

export default LandingPage;
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
import ScrollAnimation from "../../components/common/ScrollAnimation";

const sections = [
  { Component: Hero, animation: "fadeIn" as const, delay: 0 },
  { Component: PartnerNetwork, animation: "slideUp" as const, delay: 0.1 },
  { Component: ExploreCategories, animation: "slideUp" as const, delay: 0.2 },
  { Component: CourseOverview, animation: "slideUp" as const, delay: 0.3 },
  { Component: Statistic, animation: "zoomIn" as const, delay: 0.4 },
  { Component: OurMentor, animation: "slideUp" as const, delay: 0.5 },
  { Component: Review, animation: "fadeIn" as const, delay: 0.6 },
  { Component: OurBlog, animation: "slideUp" as const, delay: 0.7 },
  { Component: SubscribeSection, animation: "fadeIn" as const, delay: 0.8 },
];

const LandingPage = () => {
  return (
    <Row gutter={[0, 80]} justify="center" style={{ marginBottom: "30px" }}>
      {sections.map(({ Component, animation, delay }, index) => (
        <Col key={index} span={24}>
          <ScrollAnimation animationType={animation} delay={delay}>
            <Component />
          </ScrollAnimation>
        </Col>
      ))}
    </Row>
  );
};

export default LandingPage;
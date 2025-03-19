import { Col, Row } from "antd";
import Hero from "../../components/sections/Hero";
import PartnerNetwork from "../../components/sections/PartnerNetwork";
import ExploreCategories from "../../components/sections/ExploreCategories";
import CourseOverview from "../../components/sections/CourseOverview";
import Statistic from "../../components/sections/Statistic";
import OurMentor from "../../components/sections/OurMentor";
import Review from "../../components/sections/Reviews";
import OurBlog from "../../components/sections/OurBlog";
import SubscribeSection from "../../components/sections/SubscribeSection";
import SectionLayout from "../../layouts/SectionLayout";
import MainLayout from "../../layouts/MainLayout";

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
    <MainLayout title="L EDU | Home">
      <Row gutter={[0, 80]} justify="center" style={{ marginBottom: "30px" }}>
        {sections.map((Section, index) => (
          <Col key={index} span={24}>
            <Section />
          </Col>
        ))}
      </Row>
    </MainLayout>
  );
};

export default LandingPage;
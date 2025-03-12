import { Col, FloatButton, Layout, Row } from "antd";
import Hero from "../../components/sections/Hero";
import PartnerNetwork from "../../components/sections/PartnerNetwork";
import ExploreCategories from "../../components/sections/ExploreCategories";
import CourseOverview from "../../components/sections/CourseOverview";
import Statistic from "../../components/sections/Statistic";
import OurMentor from "../../components/sections/OurMentor";
import Review from "../../components/sections/Reviews";
import OurBlog from "../../components/sections/OurBlog";
import SubscribeSection from "../../components/sections/SubscribeSection";
import { Helmet } from "react-helmet-async";
import { RootState, useSelector } from "../../redux/store";

const { Content } = Layout;

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
    <Layout>
      <Helmet>
        <title>Home | L-Edu</title>
      </Helmet>
      <Content>
        <Row gutter={[0, 80]} justify="center" style={{ marginBottom: "30px" }}>
          {sections.map((Section, index) => (
            <Col key={index} span={24}>
              <Section />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default LandingPage;
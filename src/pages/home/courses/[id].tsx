import { EyeOutlined, LockOutlined, LogoutOutlined, PlusOutlined, ProductOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Grid, Image, Row, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import ReturnPage from "../../../components/common/ReturnPage";
import { COLORS } from "../../../constants/colors";
import { Mode } from "../../../enum/course.enum";
import { Role } from "../../../enum/user.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getCourseById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { useIsAdmin } from "../../../utils/auth";

const { Text } = Typography;
const useBreakpoint = Grid.useBreakpoint;

const Session = ({ item, index }: { item: any; index: number }) => {
  const sections = [
    { name: "Note document", icon: "/images/icons/course/doc.png", id: item._id, status: item.modeNoteMd === Mode.OPEN },
    { name: "Video document", icon: "/images/icons/course/video.png", id: item._id, status: item.modeVideoUrl === Mode.OPEN },
    { name: "Quiz document", icon: "/images/icons/course/quiz.png", id: item._id, status: item.modeQuizId === Mode.OPEN },
  ];
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const handleView = (link: string, name: string) => {
    if (name === "Note document") navigate(`/course/document/${link}`);
    if (name === "Video document") navigate(`/course/video/${link}`);
    if (name === "Quiz document") navigate(`/course/quiz/${link}`);
  };
  const isAdmin = useIsAdmin();

  return (
    <Row gutter={[0, 20]} style={styles.container}>
      <Col span={24}>
        <Row justify="space-between" align="middle" gutter={[10, 10]}>
          <Col xs={24} sm={24} md={20} lg={20}>
            <Title level={4} style={styles.sessionTitle}>
              Lesson {item.sessionNumber}. {item.title}
            </Title>
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} style={{ textAlign: "right" }}>
            <EyeOutlined style={styles.viewIcon} />
            <Text style={styles.viewText}>{item?.views || 0} views</Text>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[20, 20]}>
          {sections.map((section, index) => (
            <Col key={index} span={24}>
              <Row justify="start" align="middle" style={styles.boxSession}>
                <Col xs={2} sm={2} md={2} lg={1}>
                  <img src={section.icon} alt={section.name} style={styles.icon} />
                </Col>
                <Col xs={20} sm={20} md={19} lg={20}>
                  <Text style={styles.sectionText}>{section.name}</Text>
                </Col>
                <Col xs={2} sm={2} md={3} lg={3} style={styles.boxButton}>
                  <Button
                    style={styles.button}
                    icon={screens.md ? undefined : <LogoutOutlined />}
                    disabled={!section.status}
                    onClick={() => handleView(section.id, section.name)}
                  >
                    {!screens.md ? "" : (section.status ? "View" : "Locked")}
                  </Button>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Col>
      {isAdmin && (
        <Col span={24}>
          <Flex justify="center" align="center" style={{ zIndex: 10 }}>
            <Button
              type="primary"
              icon={<ProductOutlined />}
              size="large"
              onClick={() => navigate(`/session/updateSession/${item._id}`)}
              style={styles.updateButton}
            >
              Update Session
            </Button>
          </Flex>
        </Col>
      )}
      {item.mode === Mode.CLOSE && (
        <Flex style={styles.lock} justify="center" align="center" vertical>
          <LockOutlined style={styles.lockIcon} />
          <Title level={3} style={styles.lockText}>Temporarily Locked</Title>
        </Flex>
      )}
    </Row>
  );
};

const CourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { course, loading } = useSelector((state: RootState) => state.courses);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetch();
  }, [id, dispatch]);

  const fetch = async () => {
    try {
      const result = await dispatch(getCourseById(id as string));
      if (getCourseById.rejected.match(result)) {
        navigate(-1);
      }
    } catch (error) {
      navigate(-1);
    }
  };

  const handleAddSession = () => {
    navigate(`../session/addSession/${id}`);
  };

  return loading ? (
    <Loading />
  ) : (
    course && (
      <SectionLayout title={course.name} style={styles.sectionLayout}>
        <Row style={{ marginBottom: "60px" }} gutter={[20, 20]}>
          <ReturnPage />
          <Col span={24}>
            <Flex justify="space-between" align="center">
              <Title level={2} style={styles.courseTitle}>
                {course.name}
              </Title>
              {user && user.role === Role.ADMIN && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleAddSession}
                  style={styles.addButton}
                >
                  Add Session
                </Button>
              )}
            </Flex>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <Image
              src={course.cover || "/images/landing/sections/fakeImages/thumbnailCourse.png"}
              alt="Hero"
              style={styles.coverImage}
            />
          </Col>
          <Col span={24}>
            <div
              style={styles.description}
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </Col>
          <Col span={24}>
            <Row gutter={[20, 40]}>
              {course.sessions?.map((item: any, index: number) => (
                <Col span={24} key={index}>
                  <Session item={item} index={index} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </SectionLayout>
    )
  );
};

export default CourseDetail;

const styles: {
  [key: string]: CSSProperties;
} = {
  sectionLayout: {
    background: COLORS.background.secondary,
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
  },
  courseTitle: {
    fontSize: "36px",
    fontWeight: 700,
    color: COLORS.text.heading,
    marginBottom: "20px",
  },
  addButton: {
    background: COLORS.primary[500],
    color: COLORS.background.primary,
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  coverImage: {
    borderRadius: "12px",
    width: "100%",
    height: "500px",
    objectFit: "cover",
  },
  description: {
    color: COLORS.text.primary,
    fontSize: "16px",
    lineHeight: "1.8",
    background: COLORS.background.primary,
    padding: "20px",
    borderRadius: "12px",
    border: `1px solid ${COLORS.neutral[200]}`,
    margin: "20px 0",
  },
  container: {
    padding: "20px",
    background: COLORS.background.primary,
    borderRadius: "12px",
    border: `1px solid ${COLORS.neutral[200]}`,
    position: "relative",
  },
  sessionTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: COLORS.text.heading,
    marginTop: "10px",
  },
  viewIcon: {
    color: COLORS.primary[500],
    marginRight: "8px",
  },
  viewText: {
    color: COLORS.text.secondary,
    fontSize: "14px",
  },
  boxSession: {
    padding: "10px",
    background: COLORS.background.tertiary,
    borderRadius: "8px",
    border: `1px solid ${COLORS.neutral[200]}`,
  },
  icon: {
    width: "30px",
    height: "30px",
  },
  sectionText: {
    color: COLORS.text.primary,
    fontSize: "16px",
  },
  boxButton: {
    textAlign: "right",
  },
  button: {
    background: COLORS.primary[500],
    color: COLORS.background.primary,
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  updateButton: {
    background: COLORS.primary[500],
    color: COLORS.background.primary,
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  lock: {
    position: "absolute",
    top: 0,
    right: 0,
    color: COLORS.text.secondary,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    opacity: 0.8,
    borderRadius: "12px",
    zIndex: 1,
  },
  lockIcon: {
    fontSize: "30px",
    color: COLORS.primary[500],
  },
  lockText: {
    color: COLORS.text.primary,
  },
};
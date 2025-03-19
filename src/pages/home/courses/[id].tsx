import { Button, Col, Flex, Grid, Image, Row, Typography } from "antd";
import SectionLayout from "../../../layouts/SectionLayout";
import Title from "antd/es/typography/Title";
import { EyeOutlined, LockOutlined, LogoutOutlined, PlusOutlined, ProductOutlined } from "@ant-design/icons";
import { CSSProperties, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dispatch, RootState, useSelector } from "../../../redux/store";
import { getCourseById } from "../../../redux/slices/courses";
import Loading from "../../../components/common/Loading";
import { Mode } from "../../../enum/course.enum";
import { Role } from "../../../enum/user.enum";
import { useIsAdmin } from "../../../utils/auth";
import ReturnPage from "../../../components/common/ReturnPage";

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
  const { course, loading } = useSelector((state: RootState) => state.courses);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetch();
  }, [id]);

  const fetch = async () => {
    const check = await dispatch(getCourseById(id as string));
    if (!check) {
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
  sectionLayout: CSSProperties;
  courseTitle: CSSProperties;
  addButton: CSSProperties;
  coverImage: CSSProperties;
  description: CSSProperties;
  container: CSSProperties;
  sessionTitle: CSSProperties;
  viewIcon: CSSProperties;
  viewText: CSSProperties;
  boxSession: CSSProperties;
  icon: CSSProperties;
  sectionText: CSSProperties;
  boxButton: CSSProperties;
  button: CSSProperties;
  updateButton: CSSProperties;
  lock: CSSProperties;
  lockIcon: CSSProperties;
  lockText: CSSProperties;
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
  courseTitle: {
    fontSize: "36px",
    fontWeight: 700,
    color: "#B0E0E6", // Pale teal for the title
    textShadow: "0 0 10px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    marginBottom: "20px",
  },
  addButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(78, 205, 196, 0.5)", // Teal glow
    transition: "box-shadow 0.3s",
    fontWeight: 500,
  },
  coverImage: {
    borderRadius: "16px",
    width: "100%",
    height: "500px",
    objectFit: "cover",
    filter: "brightness(0.7)",
    transition: "filter 0.3s",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(78, 205, 196, 0.2)", // Teal glow
  },
  description: {
    color: "#B0E0E6", // Pale teal for description text
    fontSize: "16px",
    lineHeight: "1.8",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    margin: "20px 0",
  },
  container: {
    padding: "20px",
    background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(78, 205, 196, 0.2)", // Teal glow
    position: "relative",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  sessionTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#B0E0E6", // Pale teal for session title
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    marginTop: "10px",
  },
  viewIcon: {
    color: "#4ECDC4", // Brighter teal for icon
    marginRight: "8px",
  },
  viewText: {
    color: "#B0E0E6", // Pale teal for view count
    fontSize: "14px",
  },
  boxSession: {
    padding: "10px",
    background: "rgba(78, 205, 196, 0.1)", // Slightly darker teal for session box
    borderRadius: "10px",
    border: "1px solid rgba(78, 205, 196, 0.3)", // Teal border
    transition: "background 0.3s, border 0.3s",
  },
  icon: {
    width: "30px",
    height: "30px",
    filter: "brightness(0.8) hue-rotate(180deg)", // Adjust icon color to match teal theme
  },
  sectionText: {
    color: "#B0E0E6", // Pale teal for section text
    fontSize: "16px",
  },
  boxButton: {
    textAlign: "right",
  },
  button: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    transition: "box-shadow 0.3s",
    fontWeight: 500,
  },
  updateButton: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(78, 205, 196, 0.5)", // Teal glow
    transition: "box-shadow 0.3s",
    fontWeight: 500,
  },
  lock: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "#B0E0E6", // Pale teal for lock text
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.7)", // Dark overlay
    opacity: 0.8,
    borderRadius: "20px",
    zIndex: 1,
  },
  lockIcon: {
    fontSize: "30px",
    color: "#4ECDC4", // Brighter teal for lock icon
  },
  lockText: {
    color: "#B0E0E6", // Pale teal for lock text
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
};

// Add hover effects using CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  .course-session-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(78, 205, 196, 0.4);
  }
  .course-session-box:hover {
    background: rgba(78, 205, 196, 0.2);
    border: 1px solid rgba(78, 205, 196, 0.5);
  }
  .course-cover-image:hover {
    filter: brightness(1);
  }
  .course-button:hover {
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.7);
  }
  .course-update-button:hover {
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.7);
  }
`;
document.head.appendChild(styleSheet);
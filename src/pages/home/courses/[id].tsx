import { EyeOutlined, LockOutlined, LogoutOutlined, PlusOutlined, ProductOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Grid, Image, Modal, Row, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import Loading from "../../../components/common/Loading";
import ReturnPage from "../../../components/common/ReturnPage";
import { COLORS } from "../../../constants/colors";
import { Mode } from "../../../enum/course.enum";
import { examService } from "../../../services/examService";
import { ExamSummary, ExamVisibility } from "../../../types/exam";
import { Role } from "../../../enum/user.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getCourseById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { useIsAdmin } from "../../../utils/auth";
import CourseReviews from "../../../components/course/CourseReviews";

const { Text } = Typography;
const useBreakpoint = Grid.useBreakpoint;

const Session = ({ item, exams }: { item: any; exams?: ExamSummary[] }) => {
  const { t } = useTranslationWithRerender();
  
  const primaryExam = exams && exams.length > 0 ? exams[0] : undefined;

  const sections = [
    { type: "note", name: t('courseDetail.noteDocument'), icon: "/images/icons/course/doc.png", id: item._id, status: item.modeNoteMd === Mode.OPEN },
    { type: "video", name: t('courseDetail.videoDocument'), icon: "/images/icons/course/video.png", id: item._id, status: item.modeVideoUrl === Mode.OPEN },
    { type: "quiz", name: t('courseDetail.quizDocument'), icon: "/images/icons/course/quiz.png", id: item._id, status: item.modeQuizId === Mode.OPEN },
    ...(primaryExam
      ? [{ type: "exam", name: t('courseDetail.examDocument'), icon: "/images/icons/course/exam.png", id: primaryExam._id, status: true }]
      : []),
  ];
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const handleView = (section: { type: string; id: string; name: string }) => {
    if (section.type === "note") navigate(`/course/document/${section.id}`);
    if (section.type === "video") navigate(`/course/video/${section.id}`);
    if (section.type === "quiz") navigate(`/course/quiz/${section.id}`);
    if (section.type === "exam") {
      Modal.confirm({
        title: t('courseDetail.examConfirmTitle'),
        content: t('courseDetail.examConfirmDesc'),
        okText: t('courseDetail.startExam'),
        cancelText: t('common.cancel'),
        centered: true,
        onOk: () => navigate(`/exams/${section.id}`),
      });
    }
  };
  const isAdmin = useIsAdmin();

  return (
    <Row gutter={[0, 20]} style={styles.container}>
      <Col span={24}>
        <Row justify="space-between" align="middle" gutter={[10, 10]}>
          <Col xs={24} sm={24} md={20} lg={20}>
            <Title level={4} style={styles.sessionTitle}>
              {t('courseDetail.lesson')} {item.sessionNumber}. {item.title}
            </Title>
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} style={{ textAlign: "right" }}>
            <EyeOutlined style={styles.viewIcon} />
            <Text style={styles.viewText}>{item?.views || 0} {t('courseDetail.views')}</Text>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[20, 20]}>
          {sections.map((section, index) => (
            <Col key={`${section.type}-${index}`} span={24}>
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
                    onClick={() => handleView(section)}
                  >
                    {!screens.md ? "" : (section.status ? (section.type === "exam" ? t('courseDetail.startExam') : t('courseDetail.view')) : t('courseDetail.locked'))}
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
              {t('courseDetail.updateSession')}
            </Button>
          </Flex>
        </Col>
      )}
      {item.mode === Mode.CLOSE && (
        <Flex style={styles.lock} justify="center" align="center" vertical>
          <LockOutlined style={styles.lockIcon} />
          <Title level={3} style={styles.lockText}>{t('courseDetail.temporarilyLocked')}</Title>
        </Flex>
      )}
    </Row>
  );
};

const CourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslationWithRerender();
  const { course, loading } = useSelector((state: RootState) => state.courses);
  const { user } = useSelector((state: RootState) => state.auth);
  const [sessionExams, setSessionExams] = useState<Record<string, ExamSummary[]>>({});

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

  useEffect(() => {
    const loadExams = async () => {
      if (!course?._id) {
        setSessionExams({});
        return;
      }
      try {
        const exams = await examService.getExams({ courseId: course._id, visibility: ExamVisibility.PUBLISHED });
        const map: Record<string, ExamSummary[]> = {};
        exams.forEach((exam) => {
          exam.sessionIds?.forEach((sessionId) => {
            if (!map[sessionId]) map[sessionId] = [];
            map[sessionId].push(exam);
          });
        });
        setSessionExams(map);
      } catch (error) {
        setSessionExams({});
      }
    };

    loadExams();
  }, [course?._id]);

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
                  {t('courseDetail.addSession')}
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
                  <Session item={item} exams={sessionExams[item._id]} />
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={24}>
            <CourseReviews courseId={course._id} />
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
    background: "var(--bg-secondary)",
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
  },
  courseTitle: {
    fontSize: "36px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "20px",
  },
  addButton: {
    background: "var(--accent-color)",
    color: "#ffffff",
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
    color: "var(--text-primary)",
    fontSize: "16px",
    lineHeight: "1.8",
    background: "var(--bg-primary)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    margin: "20px 0",
  },
  container: {
    padding: "20px",
    background: "var(--bg-primary)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    position: "relative",
  },
  sessionTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginTop: "10px",
  },
  viewIcon: {
    color: "var(--accent-color)",
    marginRight: "8px",
  },
  viewText: {
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
  boxSession: {
    padding: "10px",
    background: "var(--bg-tertiary)",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
  },
  icon: {
    width: "30px",
    height: "30px",
  },
  sectionText: {
    color: "var(--text-primary)",
    fontSize: "16px",
  },
  boxButton: {
    textAlign: "right",
  },
  button: {
    background: "var(--accent-color)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  updateButton: {
    background: "var(--accent-color)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  lock: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "var(--text-secondary)",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    opacity: 0.8,
    borderRadius: "12px",
    zIndex: 1,
  },
  lockIcon: {
    fontSize: "30px",
    color: "var(--accent-color)",
  },
  lockText: {
    color: "var(--text-primary)",
  },
};
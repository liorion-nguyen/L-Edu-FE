import { DownOutlined, EyeOutlined, LockOutlined, LogoutOutlined, PlusOutlined, ProductOutlined, UpOutlined, BookOutlined, PlayCircleOutlined, FileTextOutlined, FilePdfOutlined, RollbackOutlined, ClockCircleOutlined, FlagOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Grid, Image, Modal, Row, Typography, Avatar, Card, Space, Tag, Alert, Spin, Descriptions } from "antd";
import Title from "antd/es/typography/Title";
import { CSSProperties, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import Loading from "../../../components/common/Loading";
import { COLORS } from "../../../constants/colors";
import { Mode } from "../../../enum/course.enum";
import { examService } from "../../../services/examService";
import { ExamSummary, ExamVisibility, ExamDetail } from "../../../types/exam";
import { Role } from "../../../enum/user.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getCourseById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { useIsAdmin } from "../../../utils/auth";
import CourseReviews from "../../../components/course/CourseReviews";
import ScrollAnimation from "../../../components/common/ScrollAnimation";
import { showNotification } from "../../../components/common/Toaster";
import { ToasterType } from "../../../enum/toaster";
import dayjs from "dayjs";
import "./courseDetail.css";

const { Text } = Typography;
const useBreakpoint = Grid.useBreakpoint;

const Session = ({ item, exams }: { item: any; exams?: ExamSummary[] }) => {
  const { t } = useTranslationWithRerender();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [examModalVisible, setExamModalVisible] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [examDetails, setExamDetails] = useState<Pick<ExamDetail, "_id" | "title" | "description" | "config" | "visibility" | "totalPoints"> | null>(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [startingExam, setStartingExam] = useState(false);

  const sections = [
    { type: "note", name: t('courseDetail.noteDocument'), icon: "/images/icons/course/doc.png", id: item._id, status: item.modeNoteMd === Mode.OPEN },
    { type: "video", name: t('courseDetail.videoDocument'), icon: "/images/icons/course/video.png", id: item._id, status: item.modeVideoUrl === Mode.OPEN },
    // { type: "quiz", name: t('courseDetail.quizDocument'), icon: "/images/icons/course/quiz.png", id: item._id, status: item.modeQuizId === Mode.OPEN },
    ...(exams && exams.length > 0
      ? exams.map((exam) => ({
          type: "exam" as const,
          name: exam.title || t('courseDetail.quizDocument'),
          icon: "/images/icons/course/quiz.png",
          id: exam._id,
          status: true,
        }))
      : []),
  ];
  const screens = useBreakpoint();

  const handleView = (section: { type: string; id: string; name: string }) => {
    if (section.type === "note") navigate(`/course/document/${section.id}`);
    if (section.type === "video") navigate(`/course/video/${section.id}`);
    if (section.type === "quiz") navigate(`/course/quiz/${section.id}`);
    if (section.type === "exam") {
      setSelectedExamId(section.id);
      setExamModalVisible(true);
      loadExamDetails(section.id);
    }
  };

  const loadExamDetails = async (examId: string) => {
    try {
      setLoadingExam(true);
      const data = await examService.getExamOverview(examId);
      setExamDetails(data);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể tải thông tin bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
      setExamModalVisible(false);
    } finally {
      setLoadingExam(false);
    }
  };

  const handleStartExam = async () => {
    if (!selectedExamId || !user?._id) {
      showNotification(ToasterType.error, "Exam", "Vui lòng đăng nhập trước khi làm bài");
      return;
    }
    try {
      setStartingExam(true);
      const attempt = await examService.createAttempt(selectedExamId, {
        studentId: user._id,
        deviceInfo: {
          userAgent: window.navigator.userAgent,
        },
      });
      setExamModalVisible(false);
      navigate(`/exams/${selectedExamId}/take?attemptId=${attempt._id}`);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể bắt đầu bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
    } finally {
      setStartingExam(false);
    }
  };

  const isAdmin = useIsAdmin();

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileTextOutlined style={styles.sectionIcon} />;
      case "video":
        return <PlayCircleOutlined style={styles.sectionIcon} />;
      case "exam":
      case "quiz":
        return <FilePdfOutlined style={styles.sectionIcon} />;
      default:
        return <BookOutlined style={styles.sectionIcon} />;
    }
  };

  return (
    <Card
      className="modern-session-card"
      style={{
        ...styles.container,
        ...(item.mode === Mode.CLOSE ? styles.lockedContainer : {}),
      }}
      hoverable
    >
      <div style={styles.sessionHeader}>
        <div style={styles.sessionHeaderLeft}>
          <div style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>
              {t('courseDetail.lesson')} {item.sessionNumber}
            </Text>
          </div>
          <Title level={4} style={styles.sessionTitle}>
            {item.title}
          </Title>
        </div>
        <div style={styles.viewCount}>
          <EyeOutlined style={styles.viewIcon} />
          <Text style={styles.viewText}>{item?.views || 0}</Text>
        </div>
      </div>

      <div style={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <div
            key={`${section.type}-${index}`}
            className={`section-item ${!section.status ? 'disabled' : ''}`}
            style={styles.sectionItem}
            onClick={() => section.status && handleView(section)}
          >
            <div style={styles.sectionIconWrapper}>
              {getSectionIcon(section.type)}
            </div>
            <div style={styles.sectionContent}>
              <Text style={styles.sectionText}>{section.name}</Text>
              {!section.status && (
                <LockOutlined style={styles.lockIconSmall} />
              )}
            </div>
            <Button
              type={section.status ? "primary" : "default"}
              icon={<LogoutOutlined />}
              disabled={!section.status}
              onClick={(e) => {
                e.stopPropagation();
                if (section.status) handleView(section);
              }}
              style={styles.sectionButton}
              className="section-action-button"
            >
              {section.status
                ? section.type === "exam"
                  ? t('courseDetail.startExam')
                  : t('courseDetail.view')
                : t('courseDetail.locked')}
            </Button>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div style={styles.adminActions}>
          <Button
            type="default"
            icon={<ProductOutlined />}
            size="large"
            onClick={() => navigate(`/session/updateSession/${item._id}`)}
            style={styles.updateButton}
            className="update-session-btn"
          >
            {t('courseDetail.updateSession')}
          </Button>
        </div>
      )}

      {item.mode === Mode.CLOSE && (
        <div style={styles.lockOverlay}>
          <LockOutlined style={styles.lockIcon} />
          <Title level={4} style={styles.lockText}>
            {t('courseDetail.temporarilyLocked')}
          </Title>
        </div>
      )}

      {/* Exam Confirmation Modal */}
      <Modal
        title={
          <div style={styles.modalTitle}>
            <div style={styles.modalTitleIcon}>
              <ExclamationCircleOutlined />
            </div>
            <div>
              <div style={styles.modalTitleText}>Sẵn sàng bắt đầu bài kiểm tra?</div>
              <div style={styles.modalTitleSubtext}>Vui lòng xem kỹ thông tin trước khi bắt đầu</div>
            </div>
          </div>
        }
        open={examModalVisible}
        onCancel={() => {
          setExamModalVisible(false);
          setExamDetails(null);
          setSelectedExamId(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setExamModalVisible(false);
              setExamDetails(null);
              setSelectedExamId(null);
            }}
            style={styles.modalCancelButton}
          >
            {t('common.cancel')}
          </Button>,
          <Button
            key="start"
            type="primary"
            loading={startingExam}
            onClick={handleStartExam}
            style={styles.modalStartButton}
            className="start-exam-confirm-btn"
          >
            {t('courseDetail.startExam')}
          </Button>,
        ]}
        width={720}
        centered
        className="exam-confirmation-modal"
        styles={{
          body: { padding: "24px" },
        }}
      >
        {loadingExam ? (
          <div style={styles.loadingContainer}>
            <Spin size="large" />
            <div style={styles.loadingText}>Đang tải thông tin bài kiểm tra...</div>
          </div>
        ) : examDetails ? (
          <div style={styles.modalContent}>
            {/* Exam Header */}
            <div style={styles.examHeader}>
              <Title level={3} style={styles.examTitle}>{examDetails.title}</Title>
              <div style={styles.examScoreBadge}>
                <Text style={styles.examScoreText}>Điểm tối đa: {examDetails.totalPoints}</Text>
              </div>
            </div>

            {/* Exam Info Cards */}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card 
                  size="small" 
                  style={styles.infoCard}
                  className="exam-info-card"
                >
                  <Descriptions column={1} size="small" colon={false}>
                    {examDetails.description && (
                      <Descriptions.Item 
                        label={<span style={styles.descriptionLabel}>📝 Mô tả</span>}
                      >
                        <Text style={styles.descriptionText}>{examDetails.description}</Text>
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item 
                      label={<span style={styles.descriptionLabel}>⏱️ Thời lượng</span>}
                    >
                      <Space>
                        <ClockCircleOutlined style={styles.infoIcon} />
                        <Text strong style={styles.infoValue}>
                          {examDetails.config.durationMinutes} phút
                        </Text>
                      </Space>
                    </Descriptions.Item>
                    {examDetails.config.passingScore !== undefined && (
                      <Descriptions.Item 
                        label={<span style={styles.descriptionLabel}>🏆 Điểm đạt</span>}
                      >
                        <Space>
                          <FlagOutlined style={styles.infoIcon} />
                          <Text strong style={styles.infoValue}>
                            {examDetails.config.passingScore} điểm
                          </Text>
                        </Space>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Settings Card */}
            <Card 
              size="small" 
              title={<span style={styles.settingsTitle}>⚙️ Cài đặt</span>}
              style={styles.settingsCard}
              className="exam-settings-card"
            >
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <div style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Xáo trộn câu hỏi</Text>
                    <Tag 
                      color={examDetails.config.shuffleQuestions ? "success" : "default"}
                      style={styles.settingTag}
                    >
                      {examDetails.config.shuffleQuestions ? "Có" : "Không"}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Xáo trộn đáp án</Text>
                    <Tag 
                      color={examDetails.config.shuffleOptions ? "success" : "default"}
                      style={styles.settingTag}
                    >
                      {examDetails.config.shuffleOptions ? "Có" : "Không"}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Cho phép quay lại</Text>
                    <Tag 
                      color={examDetails.config.allowBacktrack ? "processing" : "default"}
                      style={styles.settingTag}
                    >
                      {examDetails.config.allowBacktrack ? "Có" : "Không"}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Tự nộp khi hết giờ</Text>
                    <Tag 
                      color={examDetails.config.autoSubmit ? "error" : "default"}
                      style={styles.settingTag}
                    >
                      {examDetails.config.autoSubmit ? "Có" : "Không"}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Warning Alert */}
            <Alert
              message={<span style={styles.alertMessage}>⚠️ Lưu ý quan trọng</span>}
              description={
                <Text style={styles.alertDescription}>
                  Khi nhấn bắt đầu, thời gian sẽ được tính ngay lập tức. Hãy đảm bảo thiết bị ổn định và kết nối internet tốt trước khi bắt đầu.
                </Text>
              }
              type="warning"
              showIcon={false}
              style={styles.warningAlert}
              className="exam-warning-alert"
            />
          </div>
        ) : null}
      </Modal>
    </Card>
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch();
  }, [id, dispatch]);

  // Handle anchor link clicks in description
  useEffect(() => {
    if (!course?.description || !descriptionRef.current) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (!href) return;

        const targetId = href.substring(1); // Remove #
        
        // Expand description if collapsed
        if (!isDescriptionExpanded) {
          setIsDescriptionExpanded(true);
          // Wait for expansion animation
          setTimeout(() => {
            scrollToAnchor(targetId);
          }, 400);
        } else {
          scrollToAnchor(targetId);
        }
      }
    };

    const scrollToAnchor = (id: string) => {
      // Try multiple selector strategies
      const selectors = [
        `#${id}`,
        `[id="${id}"]`,
        `[name="${id}"]`,
        `a[name="${id}"]`
      ];

      let element: HTMLElement | null = null;

      // First try to find in description
      for (const selector of selectors) {
        element = descriptionRef.current?.querySelector(selector) as HTMLElement;
        if (element) break;
      }

      if (element && descriptionRef.current) {
        // Scroll within description container
        const container = descriptionRef.current;
        const elementTop = element.offsetTop;
        const containerTop = container.scrollTop;
        const offset = elementTop - 20;
        
        container.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
        
        // Highlight the element briefly
        element.style.transition = 'background-color 0.3s ease';
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
        setTimeout(() => {
          element!.style.backgroundColor = originalBg;
        }, 1000);
        return;
      }

      // If not found in description, try to find in entire document
      for (const selector of selectors) {
        element = document.querySelector(selector) as HTMLElement;
        if (element) break;
      }

      if (element) {
        const offsetTop = element.offsetTop - 100; // Account for header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Highlight the element briefly
        element.style.transition = 'background-color 0.3s ease';
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
        setTimeout(() => {
          element!.style.backgroundColor = originalBg;
        }, 1000);
      } else {
        console.warn(`Element with id/name "${id}" not found`);
      }
    };

    const container = descriptionRef.current;
    if (container) {
      container.addEventListener('click', handleAnchorClick);
      return () => {
        container.removeEventListener('click', handleAnchorClick);
      };
    }
  }, [course?.description, isDescriptionExpanded]);

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
        <div style={styles.pageContainer}>
          {/* Hero Section */}
          <ScrollAnimation animationType="fadeIn" delay={0}>
            <div style={styles.heroSection}>
              <div style={styles.heroImageWrapper}>
                <Image
                  src={course.cover || "/images/landing/sections/fakeImages/thumbnailCourse.png"}
                  alt={course.name}
                  style={styles.coverImage}
                  preview={false}
                />
                <div style={styles.heroOverlay} />
                {/* Return Button - Floating in top left */}
                <div style={styles.returnButtonWrapper}>
                  <Button
                    type="default"
                    icon={<RollbackOutlined />}
                    onClick={() => navigate(-1)}
                    style={styles.returnButton}
                    className="return-page-btn"
                  >
                    {t('common.returnToPrevious')}
                  </Button>
                </div>
                <div style={styles.heroContent}>
                  <Title level={1} style={styles.courseTitle}>
                    {course.name}
                  </Title>
                  {course.instructor && (
                    <div style={styles.instructorInfo}>
                      <Avatar
                        src={course.instructor.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
                        size={48}
                        style={styles.instructorAvatar}
                      />
                      <div style={styles.instructorDetails}>
                        <Text style={styles.instructorLabel}>{t('courseDetail.instructor')}</Text>
                        <Text style={styles.instructorName}>{course.instructor.fullName}</Text>
                      </div>
                    </div>
                  )}
                  {user && user.role === Role.ADMIN && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={handleAddSession}
                      style={styles.addButton}
                      className="add-session-btn"
                    >
                      {t('courseDetail.addSession')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Description Section */}
          {course.description && (
            <ScrollAnimation animationType="slideUp" delay={0.1}>
              <Card style={styles.descriptionCard} className="description-card">
                <div style={{ position: 'relative' }}>
                  <div
                    ref={descriptionRef}
                    style={{
                      ...styles.description,
                      maxHeight: isDescriptionExpanded ? 'none' : '200px',
                      overflow: isDescriptionExpanded ? 'auto' : 'hidden',
                      transition: 'max-height 0.4s ease',
                    }}
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                  {!isDescriptionExpanded && (
                    <div style={styles.descriptionGradient} />
                  )}
                </div>
                <Button
                  type="text"
                  icon={isDescriptionExpanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  style={styles.expandButton}
                  className="expand-description-btn"
                >
                  {isDescriptionExpanded ? t('courseDetail.collapse') : t('courseDetail.expand')}
                </Button>
              </Card>
            </ScrollAnimation>
          )}

          {/* Sessions Section */}
          <div style={styles.sessionsSection}>
            <Title level={2} style={styles.sessionsTitle}>
              <BookOutlined style={styles.sessionsTitleIcon} />
              {t('courseDetail.sessions') || 'Course Sessions'}
            </Title>
            <Row gutter={[24, 24]}>
              {course.sessions?.map((item: any, index: number) => (
                <Col span={24} key={item._id || index}>
                  <ScrollAnimation
                    animationType="slideUp"
                    delay={0.2 + (index % 5) * 0.05}
                  >
                    <Session item={item} exams={sessionExams[item._id]} />
                  </ScrollAnimation>
                </Col>
              ))}
            </Row>
          </div>

          {/* Reviews Section */}
          <ScrollAnimation animationType="fadeIn" delay={0.3}>
            <div style={styles.reviewsSection}>
              <CourseReviews courseId={course._id} />
            </div>
          </ScrollAnimation>
        </div>
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
    padding: "40px 0",
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
  },
  pageContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  },
  heroSection: {
    marginBottom: "40px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
  heroImageWrapper: {
    position: "relative",
    width: "100%",
    height: "500px",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%)",
    zIndex: 1,
  },
  returnButtonWrapper: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 3,
  },
  returnButton: {
    background: "rgba(255, 255, 255, 0.95)",
    color: "var(--text-primary)",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    height: "40px",
    padding: "0 20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "40px",
    zIndex: 2,
    color: "white",
  },
  courseTitle: {
    fontSize: "48px",
    fontWeight: 800,
    color: "white",
    marginBottom: "24px",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    lineHeight: "1.2",
  },
  instructorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  instructorAvatar: {
    border: "3px solid white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  instructorDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  instructorLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
  },
  instructorName: {
    color: "white",
    fontSize: "18px",
    fontWeight: 600,
  },
  addButton: {
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    height: "48px",
    padding: "0 32px",
    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
  },
  descriptionCard: {
    marginBottom: "40px",
    borderRadius: "20px",
    border: "1px solid var(--border-color)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  },
  description: {
    color: "var(--text-primary)",
    fontSize: "16px",
    lineHeight: "1.8",
    padding: "0",
  },
  descriptionGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80px",
    background: "linear-gradient(to bottom, transparent, var(--bg-primary))",
    pointerEvents: "none",
  },
  expandButton: {
    width: "100%",
    color: "var(--accent-color)",
    padding: "16px 20px",
    borderTop: "1px solid var(--border-color)",
    borderRadius: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 600,
    fontSize: "15px",
    transition: "all 0.3s ease",
  },
  sessionsSection: {
    marginBottom: "40px",
  },
  sessionsTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sessionsTitleIcon: {
    color: "var(--accent-color)",
    fontSize: "28px",
  },
  reviewsSection: {
    marginBottom: "40px",
  },
  container: {
    padding: "20px",
    background: "var(--bg-primary)",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    position: "relative",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    overflow: "hidden",
  },
  lockedContainer: {
    opacity: 0.7,
  },
  sessionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "2px solid var(--border-color)",
  },
  sessionHeaderLeft: {
    flex: 1,
    position: "relative",
  },
  sessionBadge: {
    display: "inline-block",
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    padding: "4px 12px",
    borderRadius: "16px",
    marginBottom: "8px",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
  },
  sessionBadgeText: {
    color: "white",
    fontSize: "12px",
    fontWeight: 600,
    margin: 0,
  },
  sessionTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginTop: "4px",
    marginBottom: 0,
    lineHeight: "1.3",
  },
  viewCount: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "var(--bg-secondary)",
    borderRadius: "10px",
  },
  viewIcon: {
    color: "var(--accent-color)",
    fontSize: "16px",
  },
  viewText: {
    color: "var(--text-primary)",
    fontSize: "13px",
    fontWeight: 600,
  },
  sectionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  sectionIconWrapper: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    borderRadius: "10px",
    flexShrink: 0,
  },
  sectionIcon: {
    fontSize: "20px",
    color: "white",
  },
  sectionContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionText: {
    color: "var(--text-primary)",
    fontSize: "14px",
    fontWeight: 500,
  },
  lockIconSmall: {
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
  sectionButton: {
    borderRadius: "10px",
    fontWeight: 600,
    height: "36px",
    padding: "0 16px",
    fontSize: "13px",
    flexShrink: 0,
  },
  adminActions: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "2px solid var(--border-color)",
    display: "flex",
    justifyContent: "center",
  },
  updateButton: {
    background: "transparent",
    border: "2px solid var(--accent-color)",
    color: "var(--accent-color)",
    borderRadius: "10px",
    fontWeight: 600,
    height: "38px",
    padding: "0 20px",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(4px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    borderRadius: "20px",
    zIndex: 10,
  },
  lockIcon: {
    fontSize: "48px",
    color: "var(--accent-color)",
  },
  lockText: {
    color: "white",
    margin: 0,
    fontSize: "20px",
  },
  modalTitle: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    paddingBottom: "16px",
    borderBottom: "2px solid var(--border-color)",
  },
  modalTitleIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #faad14 0%, #ffc53d 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "white",
    flexShrink: 0,
  },
  modalTitleText: {
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "4px",
  },
  modalTitleSubtext: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  modalContent: {
    paddingTop: "8px",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "60px 20px",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "15px",
    color: "var(--text-secondary)",
  },
  examHeader: {
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid var(--border-color)",
  },
  examTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "12px",
    marginTop: 0,
  },
  examScoreBadge: {
    display: "inline-block",
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    padding: "6px 16px",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
  },
  examScoreText: {
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    margin: 0,
  },
  infoCard: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  },
  descriptionLabel: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  descriptionText: {
    fontSize: "14px",
    color: "var(--text-primary)",
    lineHeight: "1.6",
  },
  infoIcon: {
    color: "var(--accent-color)",
    fontSize: "16px",
  },
  infoValue: {
    fontSize: "15px",
    color: "var(--text-primary)",
  },
  settingsCard: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    marginTop: "16px",
  },
  settingsTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
  },
  settingLabel: {
    fontSize: "14px",
    color: "var(--text-primary)",
    fontWeight: 500,
  },
  settingTag: {
    fontSize: "13px",
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: "12px",
    margin: 0,
  },
  warningAlert: {
    marginTop: "20px",
    borderRadius: "12px",
    border: "2px solid #faad14",
    background: "rgba(250, 173, 20, 0.1)",
  },
  alertMessage: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#faad14",
  },
  alertDescription: {
    fontSize: "14px",
    color: "var(--text-primary)",
    lineHeight: "1.6",
    display: "block",
    marginTop: "8px",
  },
  modalCancelButton: {
    borderRadius: "10px",
    height: "44px",
    padding: "0 24px",
    fontWeight: 600,
    fontSize: "15px",
  },
  modalStartButton: {
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "10px",
    height: "44px",
    padding: "0 32px",
    fontWeight: 600,
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
};
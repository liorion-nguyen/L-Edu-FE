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
import { getUser } from "../../../redux/slices/auth";
import { useIsAdmin } from "../../../utils/auth";
import { studentDashboardDocumentPath, studentDashboardVideoPath } from "../../../utils/studentDashboardRoutes";
import CourseReviews from "../../../components/course/CourseReviews";
import ScrollAnimation from "../../../components/common/ScrollAnimation";
import { showNotification } from "../../../components/common/Toaster";
import { ToasterType } from "../../../enum/toaster";
import dayjs from "dayjs";
import "./courseDetail.css";

const { Text } = Typography;
const useBreakpoint = Grid.useBreakpoint;

export const Session = ({
  item,
  exams,
  hideAdminActions,
  variant = "default",
}: {
  item: any;
  exams?: ExamSummary[];
  /** Ẩn nút cập nhật session (dùng trong student dashboard) */
  hideAdminActions?: boolean;
  /** Giao diện tối khớp student dashboard (`/dashboard-program/courses/...`) */
  variant?: "default" | "dashboard";
}) => {
  const { t } = useTranslationWithRerender();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    if (section.type === "note") {
      if (variant === "dashboard") {
        navigate(studentDashboardDocumentPath(section.id));
        return;
      }
      window.open(`/course/document/${section.id}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (section.type === "video") {
      if (variant === "dashboard") {
        navigate(studentDashboardVideoPath(section.id));
        return;
      }
      navigate(`/course/video/${section.id}`);
    }
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
    if (!selectedExamId) return;

    // If token exists but redux user is not hydrated yet, fetch user first.
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt-access-token") : null;
    let fetchedUserId: string | undefined;
    if (!user?._id && token) {
      const result = await dispatch(getUser());
      if (getUser.rejected.match(result)) {
        showNotification(ToasterType.error, "Exam", "Vui lòng đăng nhập trước khi làm bài");
        return;
      }
      fetchedUserId = (result as any)?.payload?._id;
    }
    const latestUserId = (user?._id ?? fetchedUserId) as string | undefined;
    if (!latestUserId) {
      showNotification(ToasterType.error, "Exam", "Vui lòng đăng nhập trước khi làm bài");
      return;
    }
    try {
      setStartingExam(true);
      const attempt = await examService.createAttempt(selectedExamId, {
        studentId: latestUserId,
        deviceInfo: {
          userAgent: window.navigator.userAgent,
        },
      });
      setExamModalVisible(false);
      const examBase = variant === "dashboard" ? "/dashboard-program/exams" : "/exams";
      navigate(`${examBase}/${selectedExamId}/take?attemptId=${attempt._id}`);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể bắt đầu bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
    } finally {
      setStartingExam(false);
    }
  };

  const isAdmin = useIsAdmin();
  const isDash = variant === "dashboard";
  const sessionLocked = item.mode === Mode.CLOSE;

  const sessionCardClass = [
    "modern-session-card",
    isDash && "session-card-dashboard",
    "!rounded-2xl !border !relative !overflow-hidden transition-all duration-300",
    isDash
      ? "!bg-slate-800/55 !border-slate-600/95 !shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
      : "!bg-[var(--bg-primary)] !border-[var(--border-color)] !shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
    sessionLocked && (isDash ? "!opacity-[0.88]" : "!opacity-70"),
  ]
    .filter(Boolean)
    .join(" ");

  const getSectionIcon = (type: string) => {
    const iconClass = "text-xl text-white";
    switch (type) {
      case "note":
        return <FileTextOutlined className={iconClass} />;
      case "video":
        return <PlayCircleOutlined className={iconClass} />;
      case "exam":
      case "quiz":
        return <FilePdfOutlined className={iconClass} />;
      default:
        return <BookOutlined className={iconClass} />;
    }
  };

  return (
    <Card className={sessionCardClass} styles={{ body: { padding: 20 } }} hoverable>
      <div
        className={[
          "flex justify-between items-start mb-4 pb-3 border-b-2",
          isDash ? "border-slate-600" : "border-[var(--border-color)]",
        ].join(" ")}
      >
        <div className="flex-1 relative min-w-0">
          <div
            className={[
              "inline-block px-3 py-1 rounded-2xl mb-2 shadow-md",
              isDash
                ? "bg-gradient-to-br from-[#007fff] to-[#0056b3] shadow-[0_2px_10px_rgba(0,127,255,0.35)]"
                : "bg-gradient-to-br from-[var(--accent-color)] to-[#764ba2]",
            ].join(" ")}
          >
            <Text className="!text-white !text-xs !font-semibold !m-0">
              {t("courseDetail.lesson")} {item.sessionNumber}
            </Text>
          </div>
          <Title
            level={4}
            className={
              isDash
                ? "!mt-1 !mb-0 !text-xl !font-bold !text-slate-50 !leading-snug"
                : "!mt-1 !mb-0 !text-xl !font-bold !text-[var(--text-primary)] !leading-snug"
            }
          >
            {item.title}
          </Title>
        </div>
        <div
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] shrink-0",
            isDash ? "bg-slate-950/95 border border-slate-600/85" : "bg-[var(--bg-secondary)]",
          ].join(" ")}
        >
          <EyeOutlined className={isDash ? "text-sky-400 text-base" : "text-[var(--accent-color)] text-base"} />
          <Text
            className={
              isDash
                ? "!text-[13px] !font-semibold !text-slate-200 !m-0"
                : "!text-[13px] !font-semibold !text-[var(--text-primary)] !m-0"
            }
          >
            {item?.views || 0}
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {sections.map((section, index) => (
          <div
            key={`${section.type}-${index}`}
            className={[
              "section-item flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300",
              !section.status ? "disabled" : "cursor-pointer",
              isDash
                ? "bg-slate-900/72 border-slate-600/90"
                : "bg-[var(--bg-secondary)] border-[var(--border-color)]",
            ].join(" ")}
            onClick={() => section.status && handleView(section)}
          >
            <div
              className={[
                "section-icon-wrapper w-10 h-10 flex items-center justify-center shrink-0 rounded-[10px]",
                isDash
                  ? "bg-gradient-to-br from-[#007fff] to-[#0052a3]"
                  : "bg-gradient-to-br from-[var(--accent-color)] to-[#764ba2]",
              ].join(" ")}
            >
              {getSectionIcon(section.type)}
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Text
                className={
                  isDash
                    ? "!text-sm !font-medium !text-slate-200 !m-0"
                    : "!text-sm !font-medium !text-[var(--text-primary)] !m-0"
                }
              >
                {section.name}
              </Text>
              {!section.status && (
                <LockOutlined
                  className={isDash ? "text-sm text-slate-400" : "text-sm text-[var(--text-secondary)]"}
                />
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
              className={[
                "section-action-button h-9 px-4 !rounded-[10px] text-[13px] font-semibold shrink-0",
                isDash && section.status
                  ? "!rounded-xl !bg-primary !border-primary hover:!bg-[#006fe6] !shadow-md !shadow-primary/25"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {section.status
                ? section.type === "exam"
                  ? t("courseDetail.startExam")
                  : t("courseDetail.view")
                : t("courseDetail.locked")}
            </Button>
          </div>
        ))}
      </div>

      {isAdmin && !hideAdminActions && (
        <div
          className={[
            "mt-4 pt-4 border-t-2 flex justify-center",
            isDash ? "border-slate-600" : "border-[var(--border-color)]",
          ].join(" ")}
        >
          <Button
            type="default"
            icon={<ProductOutlined />}
            size="large"
            onClick={() => navigate(`/session/updateSession/${item._id}`)}
            className="update-session-btn !h-[38px] !px-5 !rounded-[10px] !text-sm !font-semibold !bg-transparent !border-2 !border-[var(--accent-color)] !text-[var(--accent-color)] transition-all duration-300"
          >
            {t("courseDetail.updateSession")}
          </Button>
        </div>
      )}

      {sessionLocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-[20px] bg-black/85 backdrop-blur-sm">
          <LockOutlined className="text-5xl text-[var(--accent-color)]" />
          <Title level={4} className="!m-0 !text-xl !text-white !font-semibold">
            {t("courseDetail.temporarilyLocked")}
          </Title>
        </div>
      )}

      {/* Exam Confirmation Modal */}
      <Modal
        open={examModalVisible}
        onCancel={() => {
          setExamModalVisible(false);
          setExamDetails(null);
          setSelectedExamId(null);
        }}
        footer={null}
        width={560}
        centered
        className="exam-confirmation-modal"
        styles={{
          body: { padding: 0 },
        }}
      >
        {loadingExam ? (
          <div className="p-10 text-center">
            <Spin size="large" />
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">Đang tải thông tin bài kiểm tra...</div>
          </div>
        ) : examDetails ? (
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#0f1923] border border-slate-200 dark:border-primary/20 shadow-2xl">
            {/* Header */}
            <div className="relative h-32 border-b border-slate-200 dark:border-primary/20 bg-primary/10 dark:bg-primary/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent" />
              <div className="absolute top-0 right-0 p-6 opacity-20 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-[96px] leading-none rotate-12">quiz</span>
              </div>
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_16px_rgba(0,127,255,0.45)]">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight truncate">
                    {examDetails.title}
                  </h3>
                  <p className="text-[11px] text-primary font-bold uppercase tracking-[0.22em]">
                    {t("courseDetail.startExam")}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-7 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 dark:bg-primary/5 border border-primary/10">
                  <span className="material-symbols-outlined text-primary mb-1">help</span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {(examDetails as any)?.questions?.length ?? "--"}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                    Questions
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 dark:bg-primary/5 border border-primary/10">
                  <span className="material-symbols-outlined text-primary mb-1">schedule</span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">{examDetails.config.durationMinutes}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                    Minutes
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 dark:bg-primary/5 border border-primary/10">
                  <span className="material-symbols-outlined text-primary mb-1">stars</span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {examDetails.config.passingScore ?? examDetails.totalPoints}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                    Min. Pts
                  </span>
                </div>
              </div>

              {/* Warnings */}
              <div className="space-y-3">
                <div className="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-200">
                  <span className="material-symbols-outlined shrink-0">warning</span>
                  <div className="text-sm">
                    <p className="font-black">Lưu ý thời gian</p>
                    <p className="opacity-80">
                      Khi nhấn bắt đầu, thời gian sẽ được tính ngay lập tức. Hãy đảm bảo thiết bị ổn định và kết nối internet tốt trước khi bắt đầu.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-lg">verified</span>
                    <span>Tự động lưu trong quá trình làm bài</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-lg">desktop_access_disabled</span>
                    <span>Thoát tab có thể ảnh hưởng đến phiên làm bài</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setExamModalVisible(false);
                    setExamDetails(null);
                    setSelectedExamId(null);
                  }}
                  className="flex-1 h-[46px] rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleStartExam}
                  disabled={startingExam}
                  className="flex-[2] h-[46px] rounded-xl font-black text-sm text-white bg-primary shadow-[0_0_16px_rgba(0,127,255,0.45)] hover:brightness-110 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {t("courseDetail.startExam")}
                  <span className="material-symbols-outlined text-[20px] leading-none">rocket_launch</span>
                </button>
              </div>
            </div>

            {/* Footer decorative */}
            <div className="px-7 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-primary/10 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                EXAM_ID: {String(examDetails._id).slice(-10).toUpperCase()}
              </span>
              <div className="flex gap-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/10" />
              </div>
            </div>
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
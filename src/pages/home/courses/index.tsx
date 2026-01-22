import { EditOutlined, LockOutlined, LoginOutlined, SearchOutlined, PlusOutlined, FilterOutlined, StarOutlined, UserAddOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Input, Row, Skeleton, Space, Tooltip, Typography, Select, Rate, Badge } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import { COLORS } from "../../../constants/colors";
import { Mode } from "../../../enum/course.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getCourses } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { CourseType } from "../../../types/course";
import { useIsAdmin } from "../../../utils/auth";
import { categoryService, Category } from "../../../services/categoryService";
import CourseRegistrationModal from "../../../components/course/CourseRegistrationModal";
import courseRegistrationService from "../../../services/courseRegistrationService";
import ScrollAnimation from "../../../components/common/ScrollAnimation";
import "./courses.css";

const { Title, Text } = Typography;

const CourseCard = ({ course }: { course: CourseType }) => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { t } = useTranslationWithRerender();
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleJoinCourse = () => {
    navigate(`/course/${course._id}`);
  };

  const handleUpdateCourse = () => {
    navigate(`/course/update/${course._id}`);
  };

  const handleRegistrationSuccess = () => {
    setRegistrationModalVisible(false);
    setRegistrationStatus('pending'); // Cập nhật trạng thái sau khi đăng ký thành công
  };

  // Kiểm tra trạng thái đăng ký của user cho khóa học này
  const checkRegistrationStatus = async () => {
    if (!user) {
      console.log('No user found, skipping registration check');
      return;
    }

    setLoadingRegistration(true);
    try {
      console.log('Checking registration status for course:', course._id, 'user:', user._id);

      // Kiểm tra token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No access token found');
        setRegistrationStatus('none');
        return;
      }

      const myRegistrations = await courseRegistrationService.getMyRegistrations();
      console.log('My registrations:', myRegistrations);

      const courseRegistration = myRegistrations.find(reg => reg.courseId === course._id);
      console.log('Found registration for this course:', courseRegistration);

      if (courseRegistration) {
        const status = courseRegistration.status.toLowerCase() as 'pending' | 'approved' | 'rejected';
        console.log('Setting registration status to:', status);
        setRegistrationStatus(status);
      } else {
        console.log('No registration found, setting status to none');
        setRegistrationStatus('none');
      }
    } catch (error: any) {
      console.error('Error checking registration status:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Nếu lỗi 401 hoặc 403, có thể là vấn đề authentication
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication error, setting status to none');
      }

      setRegistrationStatus('none');
    } finally {
      setLoadingRegistration(false);
    }
  };

  // Kiểm tra trạng thái đăng ký khi component mount
  useEffect(() => {
    checkRegistrationStatus();
  }, [user, course._id]);

  // Kiểm tra user đã tham gia khóa học chưa
  const isUserEnrolled = user && course.students && course.students.includes(user._id);

  // Hiển thị nút đăng ký nếu:
  // 1. User chưa tham gia khóa học
  // 2. Không phải admin (admin có thể edit trực tiếp)
  // 3. Chưa có đơn đăng ký hoặc đơn đăng ký bị từ chối
  const showRegistrationButton = !isUserEnrolled && !isAdmin && (registrationStatus === 'none' || registrationStatus === 'rejected');

  // Hiển thị nút "Chờ duyệt" nếu đã đăng ký và đang chờ duyệt
  const showPendingButton = !isUserEnrolled && !isAdmin && registrationStatus === 'pending';

  // Admin có thể truy cập khóa học ngay cả khi chưa enroll
  const showAdminAccessButton = !isUserEnrolled && isAdmin;
  return (
    <div style={styles.cardWrapper}>
      <Card
        hoverable
        cover={
          <div style={styles.cardCover}>
            <div style={styles.imageOverlay} />
            <img
              alt={course.name}
              src={course.cover || "/images/landing/sections/fakeImages/thumbnailCourse.png"}
              style={styles.thumbnail}
            />
            <div style={styles.cardBadges}>
              <div style={styles.countLesson}>
                <Text style={styles.countLessonText}>
                  {course.duration} {t('course.sessions')}
                </Text>
              </div>
              {course.instructor && (
                <Tooltip title={course.instructor.fullName} placement="top">
                  <a href={`../profile/${course.instructor._id}`} style={styles.avtTeacher}>
                    <Avatar
                      src={course.instructor.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
                      size={48}
                      style={styles.avatar}
                    />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        }
        style={styles.card}
        styles={{ body: styles.cardBody }}
        className="modern-course-card"
      >
        <div style={styles.cardContent}>
          <Title level={4} style={styles.nameCourse}>
            {course.name}
          </Title>

          {/* Rating Display */}
          <div style={styles.ratingSection}>
            <Rate
              disabled
              value={course.averageRating || 0}
              style={styles.rating}
              allowHalf
            />
            <span style={styles.ratingText}>
              ({course.totalReviews || 0} {t('reviews.reviews')})
            </span>
          </div>

          <div style={styles.buttonGroup}>
            {isUserEnrolled ? (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                size="large"
                onClick={handleJoinCourse}
                style={styles.joinButton}
                block
              >
                {t('course.joinCourse')}
              </Button>
            ) : showAdminAccessButton ? (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                size="large"
                onClick={handleJoinCourse}
                style={styles.joinButton}
                block
              >
                Truy cập khóa học (Admin)
              </Button>
            ) : showPendingButton ? (
              <Tooltip title="Đơn đăng ký của bạn đang chờ admin duyệt. Bạn sẽ nhận được thông báo khi có kết quả.">
                <Button
                  type="primary"
                  icon={<ClockCircleOutlined />}
                  size="large"
                  disabled
                  style={styles.pendingButton}
                  block
                >
                  Chờ duyệt
                </Button>
              </Tooltip>
            ) : showRegistrationButton ? (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                size="large"
                onClick={() => setRegistrationModalVisible(true)}
                loading={loadingRegistration}
                style={course.mode === Mode.CLOSE ? styles.lockedRegistrationButton : styles.registrationButton}
                block
              >
                {course.mode === Mode.CLOSE ? 'Đăng ký khóa học (Chờ duyệt)' : 'Đăng ký khóa học'}
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<LockOutlined />}
                size="large"
                disabled
                style={styles.joinButton}
                block
              >
                {t('course.locked')}
              </Button>
            )}
            {isAdmin && (
              <Button
                type="default"
                icon={<EditOutlined />}
                size="large"
                onClick={handleUpdateCourse}
                style={styles.updateButton}
                block
              >
                {t('course.update')}
              </Button>
            )}
          </div>
        </div>

        <CourseRegistrationModal
          visible={registrationModalVisible}
          onCancel={() => setRegistrationModalVisible(false)}
          onSuccess={handleRegistrationSuccess}
          courseId={course._id}
          courseTitle={course.name}
          isLocked={course.mode === Mode.CLOSE}
          isRejected={registrationStatus === 'rejected'}
        />
      </Card>
    </div>
  );
};

const Course = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { t } = useTranslationWithRerender();
  const { courses, totalCourse, loading } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    console.log('Course component mounted/rendered');
    return () => {
      console.log('Course component unmounted');
    };
  }, []);

  useEffect(() => {
    // Fetch categories for filter
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories({
          limit: 1000,
          isActive: true
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Set selected category from URL params
    if (categoryId) {
      setSelectedCategory(categoryId);
    } else {
      setSelectedCategory(undefined);
    }
  }, [categoryId]);

  useEffect(() => {
    if (totalCourse === 0) {
      dispatch(getCourses({}));
    }
  }, [totalCourse, dispatch]);

  useEffect(() => {
    // Fetch courses with category filter when categoryId changes
    if (categoryId) {
      dispatch(getCourses({ categoryId: categoryId }));
    } else if (selectedCategory) {
      dispatch(getCourses({ categoryId: selectedCategory }));
    }
  }, [categoryId, selectedCategory, dispatch]);

  const handleSearch = () => {
    dispatch(getCourses({ page: 0, limit: 20, name: searchQuery, categoryId: selectedCategory }));
  };

  const handleCategoryFilter = (value: string | undefined) => {
    setSelectedCategory(value);
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
    dispatch(getCourses({ page: 0, limit: 20, name: searchQuery, categoryId: value }));
  };

  const handleCreateCourse = () => {
    navigate("/course/create");
  };

  return (
    <SectionLayout title={t('course.title')} style={styles.sectionLayout}>
      <div style={styles.container}>
        {/* Header Section */}
        <ScrollAnimation animationType="fadeIn" delay={0}>
          <div style={styles.headerSection}>
            <div style={styles.headerContent}>
              <div style={styles.titleWrapper}>
                <BookOutlined style={styles.titleIcon} />
                <Title level={1} style={styles.sectionTitle}>
                  {t('course.ourCourses')}
                </Title>
              </div>
              {isAdmin && (
                <Tooltip title={t('course.adminOnly')}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleCreateCourse}
                    style={styles.createButton}
                    loading={loading}
                    className="create-course-btn"
                  >
                    {t('course.createNewCourse')}
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </ScrollAnimation>

        {/* Search and Filter Section */}
        <ScrollAnimation animationType="slideUp" delay={0.1}>
          <div style={styles.searchFilterSection}>
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={24} md={16} lg={14} xl={12}>
                <div style={styles.searchWrapper}>
                  <Input.Search
                    placeholder={t('course.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={handleSearch}
                    size="large"
                    className="modern-search-input"
                    prefix={<SearchOutlined style={styles.searchIcon} />}
                    enterButton={
                      <Button type="primary" icon={<SearchOutlined />} className="modern-search-button">
                        {t('common.search')}
                      </Button>
                    }
                  />
                </div>
              </Col>
            </Row>
          </div>
        </ScrollAnimation>

        {/* Courses Grid */}
        <div style={styles.coursesGrid}>
          {loading || !courses ? (
            <Row gutter={[24, 24]}>
              {[...Array(6)].map((_, index) => (
                <Col key={index} xs={24} sm={12} md={12} lg={8} xl={8}>
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Col>
              ))}
            </Row>
          ) : courses.length === 0 ? (
            <div style={styles.emptyState}>
              <BookOutlined style={styles.emptyIcon} />
              <Title level={3} style={styles.emptyTitle}>
                Không tìm thấy khóa học nào
              </Title>
              <Text style={styles.emptyText}>
                Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
              </Text>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {courses.map((course: CourseType, index: number) => (
                <Col key={course._id || index} xs={24} sm={12} md={12} lg={8} xl={8}>
                  <ScrollAnimation
                    animationType="slideUp"
                    delay={0.1 + (index % 6) * 0.05}
                  >
                    <CourseCard course={course} />
                  </ScrollAnimation>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </SectionLayout>
  );
};

export default Course;

const styles: {
  sectionLayout: CSSProperties;
  container: CSSProperties;
  headerSection: CSSProperties;
  headerContent: CSSProperties;
  titleWrapper: CSSProperties;
  titleIcon: CSSProperties;
  sectionTitle: CSSProperties;
  searchFilterSection: CSSProperties;
  searchWrapper: CSSProperties;
  searchInput: CSSProperties;
  searchIcon: CSSProperties;
  searchButton: CSSProperties;
  filterWrapper: CSSProperties;
  filterHeader: CSSProperties;
  filterIcon: CSSProperties;
  filterTitle: CSSProperties;
  categoryFilter: CSSProperties;
  dropdownIcon: CSSProperties;
  categoryOption: CSSProperties;
  categoryName: CSSProperties;
  courseCountBadge: CSSProperties;
  coursesGrid: CSSProperties;
  emptyState: CSSProperties;
  emptyIcon: CSSProperties;
  emptyTitle: CSSProperties;
  emptyText: CSSProperties;
  cardWrapper: CSSProperties;
  card: CSSProperties;
  cardCover: CSSProperties;
  imageOverlay: CSSProperties;
  thumbnail: CSSProperties;
  cardBadges: CSSProperties;
  countLesson: CSSProperties;
  countLessonText: CSSProperties;
  avtTeacher: CSSProperties;
  avatar: CSSProperties;
  cardContent: CSSProperties;
  nameCourse: CSSProperties;
  ratingSection: CSSProperties;
  rating: CSSProperties;
  ratingText: CSSProperties;
  buttonGroup: CSSProperties;
  cardBody: CSSProperties;
  joinButton: CSSProperties;
  updateButton: CSSProperties;
  registrationButton: CSSProperties;
  lockedRegistrationButton: CSSProperties;
  pendingButton: CSSProperties;
  createButton: CSSProperties;
} = {
  sectionLayout: {
    background: "var(--bg-secondary)",
    padding: "80px 0",
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
  },
  headerSection: {
    marginBottom: "60px",
    textAlign: "center",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "40px",
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  titleIcon: {
    fontSize: "48px",
    color: "var(--accent-color)",
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  sectionTitle: {
    fontSize: "48px",
    fontWeight: 800,
    background: "linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  createButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderColor: "transparent",
    borderRadius: "16px",
    fontWeight: 600,
    fontSize: "16px",
    height: "52px",
    padding: "0 32px",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  searchFilterSection: {
    marginBottom: "60px",
  },
  searchWrapper: {
    marginBottom: "20px",
  },
  searchInput: {
    borderRadius: "16px",
    background: "var(--bg-primary)",
    border: "2px solid var(--border-color)",
    color: "var(--text-primary)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  },
  searchIcon: {
    color: "var(--accent-color)",
    fontSize: "18px",
  },
  searchButton: {
    background: "var(--accent-color)",
    color: "white",
    border: "none",
    borderRadius: "0 16px 16px 0",
    fontWeight: 600,
  },
  filterWrapper: {
    background: "var(--bg-primary)",
    borderRadius: "16px",
    padding: "24px",
    border: "2px solid var(--border-color)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  },
  filterHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  filterIcon: {
    color: "var(--accent-color)",
    fontSize: "20px",
  },
  filterTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  categoryFilter: {
    width: "100%",
    borderRadius: "12px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  },
  dropdownIcon: {
    color: "var(--text-secondary)",
    fontSize: "12px",
    fontWeight: "bold",
  },
  categoryOption: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  categoryName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-primary)",
  },
  courseCountBadge: {
    backgroundColor: "var(--accent-color)",
  },
  coursesGrid: {
    paddingBottom: "40px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: {
    fontSize: "64px",
    color: "var(--text-secondary)",
    marginBottom: "24px",
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "12px",
  },
  emptyText: {
    fontSize: "16px",
    color: "var(--text-secondary)",
  },
  cardWrapper: {
    height: "100%",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  card: {
    borderRadius: "20px",
    overflow: "hidden",
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardCover: {
    position: "relative",
    overflow: "hidden",
    height: "240px",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
    zIndex: 1,
    transition: "opacity 0.3s ease",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  cardBadges: {
    position: "absolute",
    top: "16px",
    left: "16px",
    right: "16px",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  countLesson: {
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    padding: "8px 16px",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  countLessonText: {
    color: "white",
    fontWeight: 600,
    fontSize: "13px",
    margin: 0,
  },
  avtTeacher: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "3px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.3s ease",
    display: "block",
  },
  avatar: {
    border: "2px solid var(--accent-color)",
  },
  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  nameCourse: {
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "16px",
    marginTop: "16px",
    textAlign: "center",
    lineHeight: "1.4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  rating: {
    fontSize: "16px",
  },
  ratingText: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "auto",
  },
  cardBody: {
    padding: "28px",
    background: "var(--bg-primary)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  joinButton: {
    background: "linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    height: "48px",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  updateButton: {
    background: "transparent",
    border: "2px solid var(--accent-color)",
    borderRadius: "12px",
    color: "var(--accent-color)",
    fontWeight: 600,
    height: "48px",
    fontSize: "15px",
    transition: "all 0.3s ease",
  },
  registrationButton: {
    background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    height: "48px",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
    transition: "all 0.3s ease",
  },
  lockedRegistrationButton: {
    background: "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    height: "48px",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(250, 173, 20, 0.3)",
    transition: "all 0.3s ease",
  },
  pendingButton: {
    background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    height: "48px",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
    opacity: 0.7,
    cursor: "not-allowed",
  },
};
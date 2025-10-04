import { EditOutlined, LockOutlined, LoginOutlined, SearchOutlined, PlusOutlined, FilterOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Input, Row, Skeleton, Space, Tooltip, Typography, Select, Rate } from "antd";
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

const { Title, Text } = Typography;

const CourseCard = ({ course }: { course: CourseType }) => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { t } = useTranslationWithRerender();

  const handleJoinCourse = () => {
    navigate(`/course/${course._id}`);
  };

  const handleUpdateCourse = () => {
    navigate(`/course/update/${course._id}`);
  };

  return (
    <Card
      hoverable
      cover={
        <div style={styles.cardCover}>
          <img
            alt={course.name}
            src={course.cover || "/images/landing/sections/fakeImages/thumbnailCourse.png"}
            style={styles.thumbnail}
          />
          <Text style={styles.countLesson}>{course.duration} {t('course.sessions')}</Text>
          {course.instructor && (
            <a href={`../profile/${course.instructor._id}`} style={styles.avtTeacher}>
              <Tooltip title={course.instructor.fullName} placement="top">
                <Avatar
                  src={course.instructor.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
                  style={{ width: "100%", height: "100%", border: "2px solid var(--accent-color)" }}
                />
              </Tooltip>
            </a>
          )}
        </div>
      }
      style={styles.card}
      styles={{ body: styles.cardBody }}
    >
      <Title level={4} style={styles.nameCourse}>
        {course.name}
      </Title>
      
      {/* Rating Display */}
      <div style={styles.ratingSection}>
        <Rate 
          disabled 
          value={course.averageRating || 0} 
          style={styles.rating}
        />
        <span style={styles.ratingText}>
          ({course.totalReviews || 0} {t('reviews.reviews')})
        </span>
      </div>
      
      <Space direction="horizontal" size="middle" style={{ width: "100%", justifyContent: "center" }}>
        <Button
          type="primary"
          icon={course.mode === Mode.CLOSE ? <LockOutlined /> : <LoginOutlined />}
          size="large"
          onClick={handleJoinCourse}
          disabled={course.mode === Mode.CLOSE}
          style={styles.joinButton}
        >
          {course.mode === Mode.CLOSE ? t('course.locked') : t('course.joinCourse')}
        </Button>
        {isAdmin && (
          <Button
            type="default"
            icon={<EditOutlined />}
            size="large"
            onClick={handleUpdateCourse}
            style={styles.updateButton}
          >
            {t('course.update')}
          </Button>
        )}
      </Space>
    </Card>
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
      <Row gutter={[32, 32]} style={{ textAlign: "center", paddingBottom: "80px" }}>
        <Col span={24}>
          <div style={styles.headerSection}>
            <Title level={2} style={styles.sectionTitle}>
              {t('course.ourCourses')}
            </Title>
            {isAdmin && (
              <Tooltip title={t('course.adminOnly')}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleCreateCourse}
                  style={styles.createButton}
                  loading={loading}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4)";
                    }
                  }}
                >
                  {t('course.createNewCourse')}
                </Button>
              </Tooltip>
            )}
          </div>
          <Row justify="center" style={{ marginBottom: "40px" }}>
            <Col xs={24} sm={20} md={16} lg={12}>
              <Input.Search
                placeholder={t('course.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                size="large"
                style={styles.searchInput}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />} style={styles.searchButton}>
                    {t('common.search')}
                  </Button>
                }
              />
            </Col>
          </Row>
          <Row justify="center" style={{ marginBottom: "20px" }}>
            <Col xs={24} sm={20} md={16} lg={12}>
              <div style={styles.filterSection}>
                <div style={styles.filterHeader}>
                  <FilterOutlined style={styles.filterIcon} />
                  <span style={styles.filterTitle}>{t('course.filterByCategory')}</span>
                </div>
                <Select
                  placeholder={t('course.selectCategory')}
                  value={selectedCategory}
                  onChange={handleCategoryFilter}
                  allowClear
                  style={styles.categoryFilter}
                  size="large"
                  suffixIcon={<span style={styles.dropdownIcon}>▼</span>}
                  optionLabelProp="label"
                >
                  {categories.map((category) => (
                    <Select.Option 
                      key={category._id} 
                      value={category._id}
                      label={category.name}
                    >
                      <div style={styles.categoryOption}>
                        <span style={styles.categoryName}>{category.name}</span>
                        <span style={styles.courseCountBadge}>
                          {category.courseCount} {t('course.courses')}
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {loading || !courses ? (
            <Row gutter={[32, 32]}>
              {[...Array(6)].map((_, index) => (
                <Col key={index} xs={24} sm={12} md={12} lg={8}>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </Col>
              ))}
            </Row>
          ) : (
            <Row gutter={[32, 32]}>
              {courses.map((course: CourseType, index: number) => (
                <Col key={index} xs={24} sm={12} md={12} lg={8}>
                  <CourseCard course={course} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
      
    </SectionLayout>
  );
};

export default Course;

const styles: {
  sectionLayout: CSSProperties;
  headerSection: CSSProperties;
  sectionTitle: CSSProperties;
  searchInput: CSSProperties;
  searchButton: CSSProperties;
  createButton: CSSProperties;
  filterSection: CSSProperties;
  filterHeader: CSSProperties;
  filterIcon: CSSProperties;
  filterTitle: CSSProperties;
  categoryFilter: CSSProperties;
  dropdownIcon: CSSProperties;
  categoryOption: CSSProperties;
  categoryName: CSSProperties;
  courseCountBadge: CSSProperties;
  card: CSSProperties;
  cardCover: CSSProperties;
  thumbnail: CSSProperties;
  countLesson: CSSProperties;
  avtTeacher: CSSProperties;
  nameCourse: CSSProperties;
  cardBody: CSSProperties;
  joinButton: CSSProperties;
  updateButton: CSSProperties;
  ratingSection: CSSProperties;
  rating: CSSProperties;
  ratingText: CSSProperties;
} = {
  sectionLayout: {
    background: "var(--bg-secondary)",
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  },
  createButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderColor: "transparent",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "16px",
    height: "48px",
    padding: "0 24px",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  searchInput: {
    borderRadius: "8px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  },
  searchButton: {
    background: "var(--accent-color)",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
  filterSection: {
    background: "var(--bg-primary)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid var(--border-color)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  filterHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  filterIcon: {
    color: "var(--accent-color)",
    fontSize: "18px",
  },
  filterTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  categoryFilter: {
    width: "100%",
    borderRadius: "8px",
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
    background: "var(--accent-color)",
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
  },
  card: {
    borderRadius: "12px",
    overflow: "hidden",
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
  },
  cardCover: {
    position: "relative",
    borderBottom: "1px solid var(--border-color)",
  },
  thumbnail: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px 12px 0 0",
  },
  countLesson: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "var(--accent-color)",
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontWeight: 500,
    border: "1px solid var(--accent-color)",
  },
  avtTeacher: {
    position: "absolute",
    top: "16px",
    left: "16px",
    width: "40px",
    height: "40px",
    background: "var(--bg-primary)",
    borderRadius: "50%",
    padding: "2px",
  },
  nameCourse: {
    fontSize: "20px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "12px",
    textAlign: "center",
  },
  ratingSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  rating: {
    fontSize: "14px",
  },
  ratingText: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  cardBody: {
    padding: "24px",
    background: "var(--bg-primary)",
  },
  joinButton: {
    background: "var(--accent-color)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  updateButton: {
    background: "transparent",
    border: "1px solid var(--accent-color)",
    borderRadius: "8px",
    color: "var(--accent-color)",
    fontWeight: 500,
  },
};
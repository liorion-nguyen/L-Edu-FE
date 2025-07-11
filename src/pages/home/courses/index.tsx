import { EditOutlined, LockOutlined, LoginOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Input, Row, Skeleton, Space, Tooltip, Typography } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../../constants/colors";
import { Mode } from "../../../enum/course.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getCourses } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { CourseType } from "../../../types/course";
import { useIsAdmin } from "../../../utils/auth";

const { Title, Text } = Typography;

const CourseCard = ({ course }: { course: CourseType }) => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

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
          <Text style={styles.countLesson}>{course.duration} Sessions</Text>
          {course.instructor && (
            <a href={`../profile/${course.instructor._id}`} style={styles.avtTeacher}>
              <Tooltip title={course.instructor.fullName} placement="top">
                <Avatar
                  src={course.instructor.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"}
                  style={{ width: "100%", height: "100%", border: `2px solid ${COLORS.primary[500]}` }}
                />
              </Tooltip>
            </a>
          )}
        </div>
      }
      style={styles.card}
      bodyStyle={styles.cardBody}
    >
      <Title level={4} style={styles.nameCourse}>
        {course.name}
      </Title>
      <Space direction="horizontal" size="middle" style={{ width: "100%", justifyContent: "center" }}>
        <Button
          type="primary"
          icon={course.mode === Mode.CLOSE ? <LockOutlined /> : <LoginOutlined />}
          size="large"
          onClick={handleJoinCourse}
          disabled={course.mode === Mode.CLOSE}
          style={styles.joinButton}
        >
          {course.mode === Mode.CLOSE ? "Locked" : "Join Course"}
        </Button>
        {isAdmin && (
          <Button
            type="default"
            icon={<EditOutlined />}
            size="large"
            onClick={handleUpdateCourse}
            style={styles.updateButton}
          >
            Update
          </Button>
        )}
      </Space>
    </Card>
  );
};

const Course = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useDispatch();
  const { courses, totalCourse, loading } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    console.log('Course component mounted/rendered');
    return () => {
      console.log('Course component unmounted');
    };
  }, []);

  useEffect(() => {
    if (totalCourse === 0) {
      dispatch(getCourses({}));
    }
  }, [totalCourse, dispatch]);

  const handleSearch = () => {
    dispatch(getCourses({ page: 0, limit: 20, name: searchQuery }));
  };

  return (
    <SectionLayout title="Courses" style={styles.sectionLayout}>
      <Row gutter={[32, 32]} style={{ textAlign: "center", paddingBottom: "80px" }}>
        <Col span={24}>
          <Title level={2} style={styles.sectionTitle}>
            Our Courses
          </Title>
          <Row justify="center" style={{ marginBottom: "40px" }}>
            <Col xs={24} sm={20} md={16} lg={12}>
              <Input.Search
                placeholder="Search for a course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                size="large"
                style={styles.searchInput}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />} style={styles.searchButton}>
                    Search
                  </Button>
                }
              />
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
  sectionTitle: CSSProperties;
  searchInput: CSSProperties;
  searchButton: CSSProperties;
  card: CSSProperties;
  cardCover: CSSProperties;
  thumbnail: CSSProperties;
  countLesson: CSSProperties;
  avtTeacher: CSSProperties;
  nameCourse: CSSProperties;
  cardBody: CSSProperties;
  joinButton: CSSProperties;
  updateButton: CSSProperties;
} = {
  sectionLayout: {
    background: COLORS.background.secondary,
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 700,
    color: COLORS.text.heading,
    marginBottom: "30px",
  },
  searchInput: {
    borderRadius: "8px",
    background: COLORS.background.primary,
    border: `1px solid ${COLORS.neutral[200]}`,
    color: COLORS.text.primary,
  },
  searchButton: {
    background: COLORS.primary[500],
    color: COLORS.background.primary,
    border: "none",
    borderRadius: "8px",
  },
  card: {
    borderRadius: "12px",
    overflow: "hidden",
    background: COLORS.background.primary,
    border: `1px solid ${COLORS.neutral[200]}`,
  },
  cardCover: {
    position: "relative",
    borderBottom: `1px solid ${COLORS.neutral[200]}`,
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
    background: COLORS.accent[100],
    padding: "6px 12px",
    borderRadius: "20px",
    color: COLORS.accent[600],
    fontWeight: 500,
    border: `1px solid ${COLORS.accent[200]}`,
  },
  avtTeacher: {
    position: "absolute",
    top: "16px",
    left: "16px",
    width: "40px",
    height: "40px",
    background: COLORS.background.primary,
    borderRadius: "50%",
    padding: "2px",
  },
  nameCourse: {
    fontSize: "20px",
    fontWeight: 600,
    color: COLORS.text.heading,
    marginBottom: "20px",
    textAlign: "center",
  },
  cardBody: {
    padding: "24px",
    background: COLORS.background.primary,
  },
  joinButton: {
    background: COLORS.primary[500],
    color: COLORS.background.primary,
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  updateButton: {
    background: "transparent",
    border: `1px solid ${COLORS.primary[500]}`,
    borderRadius: "8px",
    color: COLORS.primary[500],
    fontWeight: 500,
  },
};
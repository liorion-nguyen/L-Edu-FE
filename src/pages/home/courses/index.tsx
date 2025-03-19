import { Avatar, Button, Card, Col, Input, Row, Skeleton, Space, Tooltip, Typography } from "antd";
import { EditOutlined, LockOutlined, LoginOutlined, SearchOutlined } from "@ant-design/icons";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, dispatch } from "../../../redux/store";
import { getCourses } from "../../../redux/slices/courses";
import { CourseType } from "../../../types/course";
import { RootState } from "../../../redux/store";
import SectionLayout from "../../../layouts/SectionLayout";
import { Mode } from "../../../enum/course.enum";
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
                  style={{ width: "100%", height: "100%", border: "2px solid #40C4FF" }}
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
  const { courses, totalCourse, loading } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    if (totalCourse === 0) {
      dispatch(getCourses());
    }
  }, [totalCourse]);

  const handleSearch = () => {
    dispatch(getCourses(0, 20, searchQuery));
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
    background: "linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)",
    padding: "60px 0",
    position: "relative",
    overflow: "hidden",
    // Adding a subtle circuit pattern as a background overlay
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%2340C4FF' stroke-opacity='0.1' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%2340C4FF' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 700,
    color: "#E0E0E0",
    textShadow: "0 0 10px rgba(64, 196, 255, 0.5)",
    marginBottom: "30px",
  },
  searchInput: {
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#E0E0E0",
  },
  searchButton: {
    background: "linear-gradient(45deg, #40C4FF, #536DFE)",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(64, 196, 255, 0.5)",
    transition: "box-shadow 0.3s",
  },
  card: {
    borderRadius: "16px",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(64, 196, 255, 0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardCover: {
    position: "relative",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  thumbnail: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "16px 16px 0 0",
    filter: "brightness(0.7)",
    transition: "filter 0.3s",
  },
  countLesson: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(64, 196, 255, 0.2)",
    padding: "6px 12px",
    borderRadius: "20px",
    color: "#40C4FF",
    fontWeight: 500,
    border: "1px solid rgba(64, 196, 255, 0.5)",
  },
  avtTeacher: {
    position: "absolute",
    top: "16px",
    left: "16px",
    width: "40px",
    height: "40px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    padding: "2px",
    boxShadow: "0 0 10px rgba(64, 196, 255, 0.5)",
  },
  nameCourse: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#E0E0E0",
    marginBottom: "20px",
    textAlign: "center",
    textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
  },
  cardBody: {
    padding: "24px",
    background: "rgba(255, 255, 255, 0.05)",
  },
  joinButton: {
    background: "linear-gradient(45deg, #40C4FF, #536DFE)",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(64, 196, 255, 0.5)",
    transition: "box-shadow 0.3s",
    fontWeight: 500,
  },
  updateButton: {
    background: "transparent",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    color: "#E0E0E0",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    transition: "box-shadow 0.3s",
    fontWeight: 500,
  },
};
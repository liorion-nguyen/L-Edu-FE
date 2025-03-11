import { Avatar, Button, Col, Grid, Input, Row, Tooltip, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CourseType } from "../../../types/course";
import SectionLayout from "../../../layouts/SectionLayout";
import { LockOutlined, LoginOutlined, SearchOutlined } from "@ant-design/icons";
import { CSSProperties, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dispatch, RootState, useSelector } from "../../../redux/store";
import { getCourses } from "../../../redux/slices/courses";
import Loading from "../../../components/common/Loading";
import { Mode } from "../../../enum/course.enum";

const Text = Typography.Text;
const { useBreakpoint } = Grid;

const ItemCourse = (item: CourseType) => {
    const navigate = useNavigate();
    const handleJoinCourse = () => {
        navigate(`/course/${item._id}`);
    }
    return (
        <Row style={styles.container}>
            <Col span={24} style={{ position: "relative" }}>
                <img src={item.cover || "/images/landing/sections/fakeImages/thumbnailCourse.png"} alt={item.name} style={styles.thumbnail} />
                <Text style={styles.countLesson}>{item.duration} Sessions</Text>
                {
                    item.instructor &&
                    <a href={`../profile/${item.instructor._id}`} style={styles.avtTeacher}>
                        <Tooltip title={item.instructor.fullName} placement="top">
                            <Avatar src={item.instructor.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"} style={{ width: "100%", height: "100%" }} />
                        </Tooltip>
                    </a>
                }
            </Col>
            <Col span={24} style={styles.content}>
                <Title level={4} style={styles.nameCourse}>{item.name}</Title>
                <Button type="primary" icon={item.mode === Mode.CLOSE ? <LockOutlined /> : <LoginOutlined />} size={"large"} onClick={handleJoinCourse} disabled={item.mode === Mode.CLOSE}>
                {item.mode === Mode.CLOSE ? "Has Been Locked" : "Join Course"}
                </Button>
            </Col>
        </Row>
    );
};

const Course = () => {
    const screens = useBreakpoint();
    const { courses, totalCourse, loading } = useSelector((state: RootState) => state.courses);
    useEffect(() => {
        if (totalCourse === 0) {
            dispatch(getCourses());
        }
    }, []);

    return (
        <SectionLayout title="Courses">
            <Row gutter={[20, 20]} style={{ textAlign: "center", paddingBottom: "50px" }}>
                <Col span={24}>
                    <Title level={2} style={styles.nameCourse}>Our Courses</Title>
                    <Row gutter={[20, 20]} justify="center" style={{ marginBottom: "30px" }}>
                        <Col lg={12} md={16} sm={24} xs={24}>
                            <div style={styles.form}>
                                <Input placeholder="Enter what you want to search for...." style={styles.input} />
                                <Button style={styles.button} icon={screens.md ? undefined : <SearchOutlined />}>
                                    {screens.md ? "Search" : ""}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
                {
                    loading ? <Loading /> :
                        <Col span={24}>
                            <Row gutter={[20, 20]}>
                                {
                                    courses && courses.map((course, index) => (
                                        <Col key={index} lg={8} md={12} sm={12} xs={24}>
                                            <ItemCourse {...course} />
                                        </Col>
                                    ))
                                }
                            </Row>
                        </Col>
                }
            </Row>
        </SectionLayout>
    );
};

export default Course;

const styles: { input: CSSProperties, button: CSSProperties, form: CSSProperties, container: CSSProperties, thumbnail: CSSProperties, avtTeacher: CSSProperties, countLesson: CSSProperties, nameCourse: CSSProperties, content: CSSProperties } = {
    container: {
        textAlign: "center",
        boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)",
        borderRadius: "20px",
        padding: 0
    },
    thumbnail: {
        width: "100%",
        height: "200px",
        borderRadius: "20px 20px 0 0",
        objectFit: "cover",
        opacity: 0.9,
        filter: "brightness(0.8)"
    },
    countLesson: {
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "#BFECFF",
        padding: "5px 10px",
        borderRadius: "20px",
        color: "#1890FF",
    },
    avtTeacher: {
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "40px",
        height: "40px",
        background: "#ffffff",
        borderRadius: "50%",
        padding: "2px"
    },
    nameCourse: {
        margin: "20px 0",
    },
    content: {
        paddingBottom: "20px"
    },
    input: {
        border: "none",
        boxShadow: "none",
        fontSize: "16px",
        flex: 1,
        background: "transparent"
    },
    button: {
        background: "#6259E8",
        border: 0,
        fontSize: "16px"
    },
    form: {
        border: 0,
        borderRadius: "20px",
        padding: "10px 20px",
        background: "#BFECFF",
        width: '100%',
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
}
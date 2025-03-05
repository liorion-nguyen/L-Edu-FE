import { Avatar, Button, Col, Grid, Input, Row, Tooltip, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CourseType } from "../../../types/course";
import SectionLayout from "../../../layouts/SectionLayout";
import { LoginOutlined, SearchOutlined } from "@ant-design/icons";
import { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";

const Text = Typography.Text;
const { useBreakpoint } = Grid;

const ItemCourse = (item: CourseType) => {
    const navigate = useNavigate();
    const handleJoinCourse = () => {
        navigate(`/course/${item.id}`);
    }
    return (
        <Row style={styles.container}>
            <Col span={24} style={{ position: "relative" }}>
                <img src={item.thumbnail} alt={item.title} style={styles.thumbnail} />
                <Text style={styles.countLesson}>{item.countLesson} Sessions</Text>
                <a href={`../profile/${item.teacher.id}`} style={styles.avtTeacher}>
                    <Tooltip title={item.teacher.name} placement="top">
                        <Avatar src={item.teacher.avatar} style={{ width: "100%", height: "100%" }} />
                    </Tooltip>
                </a>
            </Col>
            <Col span={24} style={styles.content}>
                <Title level={4} style={styles.nameCourse}>{item.title}</Title>
                <Button type="primary" icon={<LoginOutlined />} size={"large"} onClick={handleJoinCourse}>
                    Join Course
                </Button>
            </Col>
        </Row>
    );
};

const Course = () => {
    const categories = [
        {
            id: "1",
            title: "Lập trình app(React Native)",
            description: "Học lập trình app với React Native, bạn sẽ học được cách xây dựng ứng dụng di động trên cả hai hệ điều hành Android và iOS. Bạn sẽ học được cách sử dụng React Native để xây dựng ứng dụng di động thực tế.",
            language: ["React Native", "TypeScript", "JavaScript", "HTML", "CSS"],
            thumbnail: "/images/landing/sections/fakeImages/thumbnailCourse.png",
            teacher: {
                id: "1",
                name: "John Doe",
                avatar: "/images/landing/sections/fakeImages/mentor1.png"
            },
            price: 1000000,
            discount: 0,
            status: "Open",
            countLesson: 20,
            handle: () => { }
        },
        {
            id: "2",
            title: "Lập trình web(React)",
            description: "Học lập trình web với React, bạn sẽ học được cách xây dựng ứng dụng web hiện đại với React. Bạn sẽ học được cách sử dụng React để xây dựng ứng dụng web thực tế.",
            language: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
            thumbnail: "/images/landing/sections/fakeImages/thumbnailCourse.png",
            teacher: {
                id: "1",
                name: "John Doe",
                avatar: "/images/landing/sections/fakeImages/mentor1.png"
            },
            price: 1000000,
            discount: 0,
            status: "Open",
            countLesson: 20,
            handle: () => { }
        },
        {
            id: "3",
            title: "Lập trình website cơ bản",
            description: "Học lập trình website cơ bản, bạn sẽ học được cách xây dựng website cơ bản với HTML, CSS và JavaScript. Bạn sẽ học được cách sử dụng HTML, CSS, JavaScript để xây dựng website cơ bản.",
            language: ["HTML", "CSS", "JavaScript"],
            thumbnail: "/images/landing/sections/fakeImages/thumbnailCourse.png",
            teacher: {
                id: "1",
                name: "John Doe",
                avatar: "/images/landing/sections/fakeImages/mentor1.png"
            },
            price: 1000000,
            discount: 0,
            status: "Open",
            countLesson: 20,
            handle: () => { }
        },
        {
            id: "4",
            title: "Lập trình web",
            description: "Học lập trình web, bạn sẽ học được cách xây dựng website với HTML, CSS và JavaScript. Bạn sẽ học được cách sử dụng HTML, CSS, JavaScript để xây dựng website thực tế.",
            language: ["HTML", "CSS", "JavaScript", "Firebase"],
            thumbnail: "/images/landing/sections/fakeImages/thumbnailCourse.png",
            teacher: {
                id: "1",
                name: "John Doe",
                avatar: "/images/landing/sections/fakeImages/mentor1.png"
            },
            price: 1000000,
            discount: 0,
            status: "Open",
            countLesson: 42,
            handle: () => { }
        }
    ];

    const screens = useBreakpoint();
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
                <Col span={24}>
                    <Row gutter={[20, 20]}>
                        {
                            categories.map((category, index) => (
                                <Col key={index} lg={8} md={12} sm={12} xs={24}>
                                    <ItemCourse {...category} />
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
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
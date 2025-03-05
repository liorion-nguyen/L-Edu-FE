import { Button, Col, Grid, Row, Typography } from "antd";
import SectionLayout from "../../../layouts/SectionLayout";
import Title from "antd/es/typography/Title";
import { KnowledgeType } from "../../../types/course";
import { LogoutOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

const Text = Typography.Text;
const useBreakpoint = Grid.useBreakpoint;
const Session = ({ item, index }: { item: KnowledgeType; index: number }) => {
    const sections = [
        {
            name: "Note document",
            icon: "/images/icons/course/doc.png",
            link: `../document/${item.id}`,
            status: item.content ? true : false
        },
        {
            name: "Video document",
            icon: "/images/icons/course/video.png",
            link: `../video/${item.id}`,
            status: item.video ? true : false
        },
        {
            name: "Quiz document",
            icon: "/images/icons/course/quiz.png",
            link: `../quiz/${item.id}`,
            status: item.quiz ? true : false
        }
    ];
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const handleView = (link: string) => {
        navigate(link);
    }
    return (
        <Row gutter={[0, 20]} style={styles.container}>
            <Col span={24}>
                <Title level={4} style={{ marginTop: "10px" }}>Lesson {index + 1}. {item.title}</Title>
            </Col>
            <Col span={24}>
                <Row gutter={[20, 20]}>
                    {
                        sections.map((section, index) => (
                            <Col key={index} span={24}>
                                <Row justify="start" align="middle" style={styles.boxSession}>
                                    <Col xs={2} sm={2} md={2} lg={1}>
                                        <img src={section.icon} alt={section.name} style={styles.icon} />
                                    </Col>
                                    <Col xs={20} sm={20} md={19} lg={20}>
                                        <Text>{section.name}</Text>
                                    </Col>
                                    <Col xs={2} sm={2} md={3} lg={3} style={styles.boxButton}>
                                        <Button style={styles.button} icon={screens.md ? undefined : <LogoutOutlined />} disabled={!section.status} onClick={() => {handleView(section.link)}}>
                                            {screens.md ? "Open View" : ""}
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        ))
                    }
                </Row>
            </Col>
        </Row>
    );
}


const CourseDetail = () => {
    const course = {
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
        student: ["1", "2", "3"],
        knowledge: [
            {
                id: "1",
                title: "Tuần sinh hoạt Công dân-HSSV năm học 2021-2022 cho sinh viên K71",
                content: "hello",
                status: "Open",
                video: "",
                quiz: ""
            },
            {
                id: "2",
                title: "Tuần sinh hoạt Công dân-HSSV năm học 2021-2022 cho sinh viên K71",
                content: "dsadsadsa",
                status: "Open",
                video: "",
                quiz: ""
            },
            {
                id: "3",
                title: "Tuần sinh hoạt Công dân-HSSV năm học 2021-2022 cho sinh viên K71",
                content: "sadsadsad",
                status: "Open",
                video: "",
                quiz: ""
            }
        ]
    };

    return (
        <SectionLayout title={course.title}>
            <Row style={{ marginBottom: "50px" }} gutter={[20, 20]}>
                <Col span={24}>
                    <Title level={2}>{course.title}</Title>
                </Col>
                <Col span={24}>
                    <Row gutter={[20, 40]}>
                        {
                            course.knowledge?.map((item, index) => (
                                <Col span={24} key={index}>
                                    <Session key={index} item={item} index={index} />
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
            </Row>
        </SectionLayout>
    );
};

export default CourseDetail;

const styles: { boxButton: CSSProperties, button: CSSProperties, icon: CSSProperties, boxSession: CSSProperties, container: CSSProperties } = {
    boxButton: {
        textAlign: "right"
    },
    button: {
        background: "#6259E8",
        border: 0,
        fontSize: "16px"
    },
    icon: {
        width: "30px",
        height: "30px"
    },
    boxSession: {
        padding: "10px",
        background: "#f0f2f5",
        borderRadius: "10px"
    },
    container: {
        padding: "20px",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)"
    }
}
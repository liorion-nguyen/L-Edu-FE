import { Button, Col, Flex, Grid, Row, Typography } from "antd";
import SectionLayout from "../../../layouts/SectionLayout";
import Title from "antd/es/typography/Title";
import { EyeOutlined, LockOutlined, LogoutOutlined, PlusOutlined, ProductOutlined } from "@ant-design/icons";
import { CSSProperties, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dispatch, RootState, useSelector } from "../../../redux/store";
import { getCourseById } from "../../../redux/slices/courses";
import Loading from "../../../components/common/Loading";
import { Mode } from "../../../enum/course.enum";
import { Role } from "../../../enum/user.enum";
import { useIsAdmin } from "../../../utils/auth";

const Text = Typography.Text;
const useBreakpoint = Grid.useBreakpoint;
const Session = ({ item, index }: { item: any; index: number }) => {
    const sections = [
        {
            name: "Note document",
            icon: "/images/icons/course/doc.png",
            id: item._id,
            status: item.modeNoteMd == Mode.OPEN ? true : false
        },
        {
            name: "Video document",
            icon: "/images/icons/course/video.png",
            id: item._id,
            status: item.modeVideoUrl == Mode.OPEN ? true : false
        },
        {
            name: "Quiz document",
            icon: "/images/icons/course/quiz.png",
            id: item._id,
            status: item.modeQuizId == Mode.OPEN ? true : false
        }
    ];
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const handleView = (link: string, name: string) => {
        if (name == "Note document") navigate(`/course/document/${link}`);
        if (name == "Video document") navigate(`/course/video/${link}`);
        if (name == "Quiz document") navigate(`/course/quiz/${link}`);
    }
    const isAdmin = useIsAdmin();
    return (
        <Row gutter={[0, 20]} style={styles.container}>
            <Col span={24}>
                <Flex justify="space-between" align="center">
                    <Title level={4} style={{ marginTop: "10px" }}>Lesson {item.sessionNumber}. {item.title}</Title>
                    <Flex gap={5}>
                        <EyeOutlined />
                        <Text>{item?.views || 0} views</Text>
                    </Flex>
                </Flex>
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
                                        <Button style={styles.button} icon={screens.md ? undefined : <LogoutOutlined />} disabled={!section.status} onClick={() => { handleView(section.id, section.name) }}>
                                            {screens.md ? "Open View" : ""}
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        ))
                    }
                </Row>
            </Col>
            {isAdmin && <Col span={24}>
                <Flex justify="center" align="center" style={{ zIndex: 10 }}>
                    <Button type="primary" icon={<ProductOutlined />} size="large" onClick={() => { navigate(`/session/updateSession/${item._id}`) }}>
                        Update Session
                    </Button>
                </Flex>
            </Col>
            }
            {
                item.mode === Mode.CLOSE && <Flex style={styles.lock} justify="center" align="center" vertical>
                    <LockOutlined style={{ fontSize: "30px" }} />
                    <Title level={3}>Temporarily Locked</Title>
                </Flex>
            }
        </Row>
    );
}


const CourseDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { course, loading } = useSelector((state: RootState) => state.courses);
    useEffect(() => {
        fetch();
    }, [id]);

    const fetch = async () => {
        const check = await dispatch(getCourseById(id as string));
        if (!check) {
            navigate(-1);
        }
    }
    const handleAddSession = () => {
        navigate(`../session/addSession/${id}`);
    }
    const { user } = useSelector((state: RootState) => state.auth);
    return (
        loading ? <Loading /> :
            course && <SectionLayout title={course.name}>
                <Row style={{ marginBottom: "50px" }} gutter={[20, 20]}>
                    <Col span={24}>
                        <Flex justify="space-between" align="center">
                            <Title level={2}>{course.name}</Title>
                            {
                                user && user.role === Role.ADMIN &&
                                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAddSession}>Add Session</Button>
                            }
                        </Flex>
                    </Col>
                    <Col dangerouslySetInnerHTML={{ __html: course.description }} span={24} />
                    <Col span={24}>
                        <Row gutter={[20, 40]}>
                            {
                                course.sessions?.map((item, index) => (
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

const styles: { boxButton: CSSProperties, lock: CSSProperties, button: CSSProperties, icon: CSSProperties, boxSession: CSSProperties, container: CSSProperties } = {
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
        boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)",
        position: "relative"
    },
    lock: {
        position: "absolute",
        top: "0",
        right: "0",
        color: "#f0f2f5",
        width: "100%",
        height: "100%",
        background: "grey",
        opacity: 0.3,
        borderRadius: "20px",
        zIndex: 1
    }
}
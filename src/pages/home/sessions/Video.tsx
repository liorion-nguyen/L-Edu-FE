import { EyeOutlined } from "@ant-design/icons";
import { Card, Row, Space, Typography } from "antd";
import { CSSProperties, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReturnPage from "../../../components/common/ReturnPage";
import { Mode } from "../../../enum/course.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getSessionById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";

const { Title, Text } = Typography;

// Utility to format dates
const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const Video = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { session, loading } = useSelector((state: RootState) => state.courses);

    useEffect(() => {
        fetch();
    }, [id, dispatch]);

    const fetch = async () => {
        if (session) {
            return;
        }
        try {
            const result = await dispatch(getSessionById(id as string));
            if (getSessionById.rejected.match(result)) {
                navigate(-1);
            }
        } catch (error) {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <SectionLayout title={document.title} style={styles.section}>
                <Row justify="center" align="middle" style={{ height: "100vh" }}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </Row>
            </SectionLayout>
        );
    }

    if (!session) {
        return (
            <SectionLayout title={document.title} style={styles.section}>
                <Row justify="center" align="middle" style={{ height: "100vh" }}>
                    <Text style={styles.loadingText}>Session not found.</Text>
                </Row>
            </SectionLayout>
        );
    }

    const modifyVideoHtml = (html: string) => {
        return html.replace(
            /<video([^>]*)>/,
            '<video$1 style="width: 100%;">'
        );
    };

    return (
        <SectionLayout title={document.title} style={styles.section}>
            {/* Luxurious Header Section */}
            <Card style={styles.headerCard}>
                <ReturnPage />
                <Title level={1} style={styles.title}>
                    {session.title || "Untitled Session"}
                </Title>
                <Space size="middle" style={styles.meta}>
                    <Text style={styles.metaText}>
                        <Text strong style={styles.metaLabel}>
                            Session:
                        </Text>{" "}
                        {session.sessionNumber}
                    </Text>
                    <Text style={styles.metaText}>
                        <Text strong style={styles.metaLabel}>
                            Views:
                        </Text>{" "}
                        <EyeOutlined style={{ marginRight: 5 }} /> {session.views}
                    </Text>
                    <Text style={styles.metaText}>
                        <Text strong style={styles.metaLabel}>
                            Created:
                        </Text>{" "}
                        {formatDate(session.createdAt)}
                    </Text>
                </Space>
            </Card>

            {/* Video Section */}
            {session.videoUrl?.mode === Mode.OPEN && (
                <Row justify="center" style={{ marginBottom: 32, width: "100%" }}>
                    <Card style={styles.videoCard}>
                        <div
                            style={styles.video}
                            dangerouslySetInnerHTML={{ __html: modifyVideoHtml(session.videoUrl.videoUrl) }}
                        />
                    </Card>
                </Row>
            )}
        </SectionLayout>
    );
};

export default Video;

const styles: {
    [key: string]: CSSProperties;
} = {
    section: {
        background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
        padding: "50px 20px",
        // Subtle circuit pattern in lighter teal
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
    },
    loadingText: {
        color: "#B0E0E6", // Pale teal for text
        fontSize: "18px",
    },
    headerCard: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        borderRadius: 16,
        marginBottom: 24,
        transition: "box-shadow 0.3s, transform 0.3s",
    },
    title: {
        color: "#B0E0E6", // Pale teal for text
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
        marginTop: 16,
        marginBottom: 8,
    },
    meta: {
        flexWrap: "wrap",
    },
    metaText: {
        color: "#B0E0E6", // Pale teal for text
        fontSize: "14px",
    },
    metaLabel: {
        color: "#4ECDC4", // Brighter teal for labels
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    },
    videoCard: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        borderRadius: 16,
        padding: 0,
        overflow: "hidden",
        transition: "box-shadow 0.3s, transform 0.3s",
    },
    video: {
        width: "100%",
        height: "auto",
    }
};

// Add hover effects and animations using CSS
const styleSheetVideo = document.createElement("style");
styleSheetVideo.innerText = `
  .ant-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-5px);
  }
  .ant-btn:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetVideo);
import { EyeOutlined } from "@ant-design/icons";
import { Card, Row, Space, Typography } from "antd";
import { CSSProperties, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardProgramBackButton from "../../../components/common/DashboardProgramBackButton";
import Loading from "../../../components/common/Loading";
import ReturnPage from "../../../components/common/ReturnPage";
import { Mode } from "../../../enum/course.enum";
import SectionLayout from "../../../layouts/SectionLayout";
import { getSessionById } from "../../../redux/slices/courses";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import { isDashboardProgramLearnPath } from "../../../utils/studentDashboardRoutes";

const { Title, Text } = Typography;

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
  const location = useLocation();
  const dispatch = useDispatch();
  const { session, loading } = useSelector((state: RootState) => state.courses);
  const isDashboardLearn = isDashboardProgramLearnPath(location.pathname);

  useEffect(() => {
    fetch();
  }, [id, dispatch]);

  const fetch = async () => {
    if (session && id && String((session as { _id?: string })._id) === String(id)) {
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

  if (isDashboardLearn) {
    if (loading) {
      return (
        <div className="w-full flex justify-center py-24">
          <Loading />
        </div>
      );
    }

    if (!session) {
      return (
        <div className="w-full max-w-5xl mx-auto space-y-5">
          <DashboardProgramBackButton />
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">Không tìm thấy buổi học.</p>
        </div>
      );
    }

    const modifyVideoHtml = (html: string) => html.replace(/<video([^>]*)>/, '<video$1 style="width: 100%;">');

    return (
      <div className="w-full max-w-5xl mx-auto space-y-5">
        <DashboardProgramBackButton />
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 md:p-8 shadow-sm text-slate-900 dark:text-slate-100">
          <Title level={2} className="!text-slate-900 dark:!text-white !mt-0 !mb-4">
            {session.title || "Buổi học"}
          </Title>
          <Space size="middle" wrap className="text-slate-600 dark:text-slate-400 mb-8">
            <Text>
              <Text strong className="text-primary">Buổi:</Text> {session.sessionNumber}
            </Text>
            <Text>
              <EyeOutlined className="mr-1 text-primary" />
              {session.views} lượt xem
            </Text>
            <Text>
              <Text strong className="text-primary">Tạo:</Text> {formatDate(session.createdAt)}
            </Text>
          </Space>

          {session.videoUrl?.mode === Mode.OPEN && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-black/40">
              <div dangerouslySetInnerHTML={{ __html: modifyVideoHtml(session.videoUrl.videoUrl) }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="video-legacy-page">
        <SectionLayout title={document.title} style={styles.section}>
          <Row justify="center" align="middle" style={{ height: "100vh" }}>
            <Text style={styles.loadingText}>Loading...</Text>
          </Row>
        </SectionLayout>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="video-legacy-page">
        <SectionLayout title={document.title} style={styles.section}>
          <Row justify="center" align="middle" style={{ height: "100vh" }}>
            <Text style={styles.loadingText}>Session not found.</Text>
          </Row>
        </SectionLayout>
      </div>
    );
  }

  const modifyVideoHtml = (html: string) => {
    return html.replace(/<video([^>]*)>/, '<video$1 style="width: 100%;">');
  };

  return (
    <div className="video-legacy-page">
      <SectionLayout title={document.title} style={styles.section}>
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
    </div>
  );
};

export default Video;

const styles: {
  [key: string]: CSSProperties;
} = {
  section: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)",
    padding: "50px 20px",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  loadingText: {
    color: "#B0E0E6",
    fontSize: "18px",
  },
  headerCard: {
    background: "rgba(78, 205, 196, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(78, 205, 196, 0.2)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)",
    borderRadius: 16,
    marginBottom: 24,
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  title: {
    color: "#B0E0E6",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)",
    marginTop: 16,
    marginBottom: 8,
  },
  meta: {
    flexWrap: "wrap",
  },
  metaText: {
    color: "#B0E0E6",
    fontSize: "14px",
  },
  metaLabel: {
    color: "#4ECDC4",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)",
  },
  videoCard: {
    background: "rgba(78, 205, 196, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(78, 205, 196, 0.2)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)",
    borderRadius: 16,
    padding: 0,
    overflow: "hidden",
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  video: {
    width: "100%",
    height: "auto",
  },
};

if (!document.getElementById("video-legacy-page-styles")) {
  const styleSheetVideo = document.createElement("style");
  styleSheetVideo.id = "video-legacy-page-styles";
  styleSheetVideo.innerText = `
  .video-legacy-page .ant-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-5px);
  }
  .video-legacy-page .ant-btn:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
  document.head.appendChild(styleSheetVideo);
}

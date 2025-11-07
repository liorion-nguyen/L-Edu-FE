import { CalendarOutlined, ClockCircleOutlined, FlagOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Descriptions, Row, Space, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "../../redux/store";
import { examService } from "../../services/examService";
import { ExamDetail } from "../../types/exam";
import { RootState } from "../../redux/store";
import { showNotification } from "../../components/common/Toaster";
import { ToasterType } from "../../enum/toaster";

const { Title, Text } = Typography;

const ExamOverviewPage: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Pick<ExamDetail, "_id" | "title" | "description" | "config" | "visibility" | "totalPoints"> | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOverview = async () => {
      if (!examId) return;
      try {
        setLoading(true);
        const data = await examService.getExamOverview(examId);
        setExam(data);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải thông tin bài kiểm tra";
        showNotification(ToasterType.error, "Exam", message);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [examId, dispatch]);

  const handleStartAttempt = async () => {
    if (!examId || !user?._id) {
      showNotification(ToasterType.error, "Exam", "Vui lòng đăng nhập trước khi làm bài");
      return;
    }
    try {
      const attempt = await examService.createAttempt(examId, {
        studentId: user._id,
        deviceInfo: {
          userAgent: window.navigator.userAgent,
        },
      });
      navigate(`/exams/${examId}/take?attemptId=${attempt._id}`);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể bắt đầu bài kiểm tra";
      showNotification(ToasterType.error, "Exam", message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
        <Spin />
      </div>
    );
  }

  if (!exam) {
    return <Alert type="warning" message="Không tìm thấy bài kiểm tra" showIcon style={{ marginTop: 40 }} />;
  }

  const { config } = exam;

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={2}>{exam.title}</Title>
          <Text type="secondary">Điểm tối đa: {exam.totalPoints}</Text>
        </div>

        <Card>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mô tả">{exam.description || "—"}</Descriptions.Item>
            <Descriptions.Item label="Thời lượng">
              <Space>
                <ClockCircleOutlined />
                {config.durationMinutes} phút
              </Space>
            </Descriptions.Item>
            {config.startTime && (
              <Descriptions.Item label="Bắt đầu">
                <Space>
                  <CalendarOutlined />
                  {dayjs(config.startTime).format("DD/MM/YYYY HH:mm")}
                </Space>
              </Descriptions.Item>
            )}
            {config.endTime && (
              <Descriptions.Item label="Kết thúc">
                <Space>
                  <CalendarOutlined />
                  {dayjs(config.endTime).format("DD/MM/YYYY HH:mm")}
                </Space>
              </Descriptions.Item>
            )}
            {config.passingScore !== undefined && (
              <Descriptions.Item label="Điểm đạt">
                <Space>
                  <FlagOutlined />
                  {config.passingScore} điểm
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        <Row gutter={16}>
          <Col span={12}>
            <Card title="Cài đặt">
              <Space direction="vertical">
                <Tag color={config.shuffleQuestions ? "green" : "default"}>
                  Xáo trộn câu hỏi: {config.shuffleQuestions ? "Có" : "Không"}
                </Tag>
                <Tag color={config.shuffleOptions ? "green" : "default"}>
                  Xáo trộn đáp án: {config.shuffleOptions ? "Có" : "Không"}
                </Tag>
                <Tag color={config.allowBacktrack ? "blue" : "default"}>
                  Cho phép quay lại: {config.allowBacktrack ? "Có" : "Không"}
                </Tag>
                <Tag color={config.autoSubmit ? "red" : "default"}>
                  Tự nộp khi hết giờ: {config.autoSubmit ? "Có" : "Không"}
                </Tag>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Alert
                  description="Khi nhấn bắt đầu, thời gian sẽ được tính. Hãy đảm bảo thiết bị ổn định và kết nối internet tốt."
                  type="info"
                  showIcon
                />
                <Button type="primary" size="large" block onClick={handleStartAttempt}>
                  Bắt đầu làm bài
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default ExamOverviewPage;


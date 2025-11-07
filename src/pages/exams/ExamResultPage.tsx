import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Alert, Button, Card, Col, Result, Row, Space, Spin, Table, Tag, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../components/common/Toaster";
import { ToasterType } from "../../enum/toaster";
import { examService } from "../../services/examService";
import { ExamAttempt, ExamDetail, ExamQuestionType } from "../../types/exam";

const { Title, Paragraph } = Typography;

const ExamResultPage: React.FC = () => {
  const { examId, attemptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [exam, setExam] = useState<ExamDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!examId || !attemptId) return;
      try {
        setLoading(true);
        const [attemptRes, examRes] = await Promise.all([
          examService.getAttempt(examId, attemptId),
          examService.getExamDetail(examId),
        ]);
        setAttempt(attemptRes);
        setExam(examRes);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải kết quả";
        showNotification(ToasterType.error, "Exam", message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId, attemptId]);

  const resultStatus = useMemo(() => {
    if (!exam || !attempt) return null;
    const passing = exam.config.passingScore ?? 0;
    const scorePercent = attempt.totalScore && attempt.maxScore ? (attempt.totalScore / attempt.maxScore) * 100 : 0;
    const isPass = scorePercent >= passing;
    return {
      isPass,
      scorePercent: Number(scorePercent.toFixed(1)),
      passing,
    };
  }, [exam, attempt]);

  const tableData = useMemo(() => {
    if (!attempt || !exam) return [];
    const questionLookup = new Map(exam.questions.map((question) => [question._id, question]));
    return attempt.answers.map((answer, index) => {
      const question = questionLookup.get(answer.questionId);
      return {
        key: answer.questionId,
        index: index + 1,
        content: question?.content,
        type: question?.type,
        score: `${answer.scoreEarned ?? 0}/${question?.points ?? 0}`,
        status: answer.isCorrect,
      };
    });
  }, [attempt, exam]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
        <Spin />
      </div>
    );
  }

  if (!attempt || !exam) {
    return <Alert type="warning" message="Không tìm thấy kết quả" showIcon style={{ marginTop: 40 }} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Result
              status={resultStatus?.isPass ? "success" : "info"}
              title={resultStatus?.isPass ? "Chúc mừng bạn đã vượt qua!" : "Bạn cần cải thiện thêm"}
              subTitle={`Điểm số: ${attempt.totalScore ?? 0}/${attempt.maxScore ?? exam.totalPoints} (${resultStatus?.scorePercent ?? 0}%)`}
              extra={
                <Space>
                  <Button type="primary" onClick={() => navigate(`/exams/${examId}`)}>
                    Làm lại (nếu được phép)
                  </Button>
                  <Button onClick={() => navigate("/")}>Về trang chủ</Button>
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Chi tiết câu hỏi">
            <Table
              pagination={false}
              dataSource={tableData}
              columns={[
                { title: "#", dataIndex: "index", width: 60 },
                { title: "Nội dung", dataIndex: "content", render: (text: string) => <Paragraph>{text}</Paragraph> },
                {
                  title: "Loại",
                  dataIndex: "type",
                  width: 160,
                  render: (type: ExamQuestionType) => {
                    switch (type) {
                      case ExamQuestionType.SINGLE:
                        return <Tag color="blue">Một đáp án</Tag>;
                      case ExamQuestionType.MULTIPLE:
                        return <Tag color="purple">Nhiều đáp án</Tag>;
                      case ExamQuestionType.FILL_IN:
                        return <Tag color="cyan">Điền nội dung</Tag>;
                      default:
                        return type;
                    }
                  },
                },
                { title: "Điểm", dataIndex: "score", width: 120 },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  width: 120,
                  render: (status: boolean) =>
                    status ? (
                      <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="success">
                        Đúng
                      </Tag>
                    ) : (
                      <Tag icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />} color="error">
                        Sai
                      </Tag>
                    ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExamResultPage;


import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Alert, Button, Card, Col, Result, Row, Space, Spin, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../components/common/Toaster";
import { ToasterType } from "../../enum/toaster";
import { examService } from "../../services/examService";
import { ExamAttempt, ExamDetail, ExamQuestionType } from "../../types/exam";
import { useSelector } from "../../redux/store";
import type { RootState } from "../../redux/store";
import { Role } from "../../enum/user.enum";

const { Title, Paragraph, Text } = Typography;

const normalizeId = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "object") {
    const objectValue = value as { toString?: () => string; toHexString?: () => string; _id?: unknown };
    if (typeof objectValue.toHexString === "function") {
      return objectValue.toHexString();
    }
    if (typeof objectValue.toString === "function") {
      const str = objectValue.toString();
      if (str && str !== "[object Object]") {
        return str;
      }
    }
    if (objectValue._id) {
      return normalizeId(objectValue._id);
    }
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const ExamResultPage: React.FC = () => {
  const { examId, attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<ExamAttempt[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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

  useEffect(() => {
    const fetchHistory = async () => {
      if (!examId) return;
      const targetStudentId = user?.role === Role.STUDENT ? user._id : attempt?.studentId;
      if (!targetStudentId) return;
      try {
        setHistoryLoading(true);
        const data = await examService.listAttempts(examId, { studentId: targetStudentId });
        setAttemptHistory(data);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải lịch sử làm bài";
        showNotification(ToasterType.error, "Exam", message);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [examId, attempt?.studentId, user?._id, user?.role]);

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

  const formatDuration = (seconds: number | null | undefined) => {
    if (seconds == null) return "—";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} phút`;
    }
    return `${minutes} phút ${remainingSeconds}s`;
  };

  const historyData = useMemo(() => {
    if (!attemptHistory || attemptHistory.length === 0) return [];
    return attemptHistory.map((item, index) => {
      const startedAt = item.startedAt ? dayjs(item.startedAt) : null;
      const submittedAt = item.submittedAt ? dayjs(item.submittedAt) : null;
      const durationSeconds = startedAt && submittedAt ? submittedAt.diff(startedAt, "second") : null;
      return {
        key: item._id,
        order: index + 1,
        attemptId: item._id,
        startedAt: startedAt ? startedAt.format("DD/MM/YYYY HH:mm") : "—",
        score: `${item.totalScore ?? 0}/${item.maxScore ?? exam?.totalPoints ?? 0}`,
        status: item.status,
        duration: formatDuration(durationSeconds ?? undefined),
        isCurrent: attemptId === item._id,
      };
    });
  }, [attemptHistory, attemptId, exam?.totalPoints]);

  const tableData = useMemo(() => {
    if (!attempt || !exam) return [];
    const questionLookup = new Map<string, (typeof exam.questions)[number]>();
    exam.questions.forEach((question) => {
      const possibleKeys = [
        normalizeId(question._id),
        normalizeId(question.id),
        normalizeId((question as any)?.originalId),
      ].filter(Boolean);
      possibleKeys.forEach((key) => {
        if (key) {
          questionLookup.set(key, question);
        }
      });
    });
    return attempt.answers.map((answer, index) => {
      const normalizedQuestionId = normalizeId(answer.questionId);
      const question = questionLookup.get(normalizedQuestionId);
      const optionLookup = new Map<string, string>();
      question?.options?.forEach((option) => {
        optionLookup.set(normalizeId(option.id), option.text);
      });

      const selectedOptions =
        question?.type === ExamQuestionType.FILL_IN
          ? answer.textAnswer
          : (answer.selectedOptionIds ?? [])
              .map((optionId) => optionLookup.get(normalizeId(optionId)) ?? normalizeId(optionId))
              .filter(Boolean)
              .join(", ");
      const correctOptions =
        question?.type === ExamQuestionType.FILL_IN
          ? (question?.textAnswers ?? []).join(", ")
          : (question?.correctAnswers ?? [])
              .map((optionId) => optionLookup.get(normalizeId(optionId)) ?? normalizeId(optionId))
              .filter(Boolean)
              .join(", ");

      return {
        key: answer.questionId,
        index: index + 1,
        content: question?.content,
        type: question?.type,
        score: `${answer.scoreEarned ?? 0}/${question?.points ?? 0}`,
        status: answer.isCorrect,
        selectedAnswer: selectedOptions || (question?.type === ExamQuestionType.FILL_IN ? answer.textAnswer ?? "" : "—"),
        correctAnswer: correctOptions || "—",
        explanation: question?.explanation,
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
          <Card title="Lịch sử làm bài">
            <Table
              pagination={false}
              dataSource={historyData}
              loading={historyLoading}
              locale={{ emptyText: "Chưa có lịch sử làm bài" }}
              columns={[
                { title: "Lần", dataIndex: "order", width: 80 },
                { title: "Thời gian", dataIndex: "startedAt", width: 200 },
                { title: "Điểm", dataIndex: "score", width: 120 },
                { title: "Thời lượng", dataIndex: "duration", width: 140 },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  width: 160,
                  render: (status: ExamAttempt["status"]) => {
                    const successStatuses = new Set(["SUBMITTED", "AUTO_SUBMITTED", "GRADED"]);
                    return (
                      <Tag color={successStatuses.has(status) ? "success" : "processing"}>
                        {status}
                      </Tag>
                    );
                  },
                },
                {
                  title: "Hành động",
                  dataIndex: "attemptId",
                  width: 160,
                  render: (_: string, record: { attemptId: string; isCurrent: boolean }) => (
                    <Button type="link" disabled={record.isCurrent} onClick={() => navigate(`/exams/${examId}/result/${record.attemptId}`)}>
                      {record.isCurrent ? "Đang xem" : "Xem chi tiết"}
                    </Button>
                  ),
                },
              ]}
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
                {
                  title: "Nội dung",
                  dataIndex: "content",
                  render: (_: any, record) => (
                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                      <Paragraph style={{ marginBottom: 0 }}>{record.content ?? "—"}</Paragraph>
                      <Space direction="vertical" size={2} style={{ width: "100%" }}>
                        <Text strong>Đáp án của bạn:</Text>
                        <Paragraph style={{ marginBottom: 0 }} type="secondary">
                          {record.selectedAnswer || "Chưa trả lời"}
                        </Paragraph>
                      </Space>
                      <Space direction="vertical" size={2} style={{ width: "100%" }}>
                        <Text strong>Đáp án đúng:</Text>
                        <Paragraph style={{ marginBottom: 0 }} type="secondary">
                          {record.correctAnswer || "—"}
                        </Paragraph>
                      </Space>
                      {record.explanation && (
                        <Paragraph style={{ marginBottom: 0 }} italic type="secondary">
                          Ghi chú: {record.explanation}
                        </Paragraph>
                      )}
                    </Space>
                  ),
                },
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


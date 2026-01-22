import { CheckCircleTwoTone, CloseCircleTwoTone, CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Col, Input, Radio, Result, Row, Space, Spin, Table, Tag, Typography } from "antd";
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
import MarkdownViewer from "../../components/common/MarkdownViewer";
import ScrollAnimation from "../../components/common/ScrollAnimation";
import "./ExamResultPage.css";

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

  // Map questions with answers for review
  const questionsWithAnswers = useMemo(() => {
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

    // Build answer map with multiple possible keys for matching
    const answerMap = new Map<string, typeof attempt.answers[number]>();
    attempt.answers.forEach((answer) => {
      const possibleKeys = [
        normalizeId(answer.questionId),
        answer.questionId, // Original ID
        normalizeId((answer as any)?._id), // In case questionId is stored as _id
      ].filter(Boolean);
      possibleKeys.forEach((key) => {
        if (key) {
          answerMap.set(key, answer);
        }
      });
    });

    return exam.questions.map((question, index) => {
      // Try multiple ways to find the matching answer
      const possibleQuestionIds = [
        normalizeId(question._id),
        question._id,
        normalizeId(question.id),
        question.id,
        normalizeId((question as any)?.originalId),
        (question as any)?.originalId,
      ].filter(Boolean);
      
      let answer: typeof attempt.answers[number] | undefined;
      for (const qId of possibleQuestionIds) {
        if (qId && answerMap.has(qId)) {
          answer = answerMap.get(qId);
          break;
        }
      }
      
      // Build sets of option IDs for comparison (both normalized and original)
      const selectedOptionIds = new Set<string>();
      (answer?.selectedOptionIds ?? []).forEach((id) => {
        selectedOptionIds.add(id); // Original ID
        selectedOptionIds.add(normalizeId(id)); // Normalized ID
      });

      // Build set of correct option IDs
      const correctOptionIds = new Set<string>();
      (question.correctAnswers ?? []).forEach((id) => {
        correctOptionIds.add(id); // Original ID
        correctOptionIds.add(normalizeId(id)); // Normalized ID
      });

      // Use answer.isCorrect if available, otherwise calculate from selected vs correct
      let isCorrect = answer?.isCorrect;
      if (isCorrect === undefined || isCorrect === null) {
        // Fallback: calculate isCorrect by comparing selectedOptionIds with correctOptionIds
        if (question.type === ExamQuestionType.FILL_IN) {
          // For FILL_IN, check if textAnswer matches any correct textAnswers
          const userAnswer = (answer?.textAnswer || "").trim().toLowerCase();
          const correctAnswers = (question.textAnswers || []).map(a => a.trim().toLowerCase());
          isCorrect = correctAnswers.includes(userAnswer);
        } else {
          // For SINGLE/MULTIPLE, check if selectedOptionIds match correctOptionIds
          const selectedArray = Array.from(selectedOptionIds);
          const correctArray = Array.from(correctOptionIds);
          if (selectedArray.length === 0 && correctArray.length === 0) {
            isCorrect = false; // No answer provided
          } else if (selectedArray.length !== correctArray.length) {
            isCorrect = false; // Different number of selections
          } else {
            // Check if all selected are correct and all correct are selected
            const allSelectedAreCorrect = selectedArray.every(id => correctOptionIds.has(id));
            const allCorrectAreSelected = correctArray.every(id => selectedOptionIds.has(id));
            isCorrect = allSelectedAreCorrect && allCorrectAreSelected;
          }
        }
      }
      
      // Use answer.scoreEarned if available, otherwise calculate from isCorrect
      let scoreEarned = answer?.scoreEarned;
      if (scoreEarned === undefined || scoreEarned === null) {
        // Fallback: calculate score based on isCorrect
        scoreEarned = isCorrect ? (question.points ?? 0) : 0;
      }
      
      const questionPoints = question.points ?? 0;

      return {
        question,
        answer,
        index: index + 1,
        isCorrect: isCorrect ?? false,
        score: `${scoreEarned}/${questionPoints}`,
        selectedOptionIds,
        correctOptionIds,
      };
    });
  }, [attempt, exam]);

  const tableData = useMemo(() => {
    if (!attempt || !exam) return [];
    return questionsWithAnswers.map((item) => {
      const { question, answer } = item;
      const optionLookup = new Map<string, string>();
      question.options?.forEach((option) => {
        optionLookup.set(normalizeId(option.id), option.text);
      });

      const selectedOptions =
        question.type === ExamQuestionType.FILL_IN
          ? answer?.textAnswer
          : Array.from(item.selectedOptionIds)
              .map((optionId) => optionLookup.get(optionId) ?? optionId)
              .filter(Boolean)
              .join(", ");
      const correctOptions =
        question.type === ExamQuestionType.FILL_IN
          ? (question.textAnswers ?? []).join(", ")
          : Array.from(item.correctOptionIds)
              .map((optionId) => optionLookup.get(optionId) ?? optionId)
              .filter(Boolean)
              .join(", ");

      return {
        key: question._id,
        index: item.index,
        content: question.content,
        type: question.type,
        score: item.score,
        status: item.isCorrect,
        selectedAnswer: selectedOptions || (question.type === ExamQuestionType.FILL_IN ? answer?.textAnswer ?? "" : "—"),
        correctAnswer: correctOptions || "—",
        explanation: question.explanation,
      };
    });
  }, [questionsWithAnswers]);

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
          <Card className="exam-review-card">
            <div className="review-header">
              <Title level={3} className="review-title">
                <FileTextOutlined /> Chi tiết câu hỏi
              </Title>
            </div>
            <div className="review-questions-list">
              {questionsWithAnswers.map((item, idx) => {
                const { question, answer, isCorrect, score } = item;
                return (
                  <ScrollAnimation key={question._id} animationType="slideUp" delay={idx * 0.05}>
                    <Card className={`review-question-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <div className="review-question-header">
                        <div className="review-question-number">
                          <FileTextOutlined className="review-question-icon" />
                          <span>Câu {item.index} / {questionsWithAnswers.length}</span>
                        </div>
                        <div className="review-question-status">
                          {isCorrect ? (
                            <Tag icon={<CheckCircleOutlined />} color="success" className="status-tag">
                              Đúng
                            </Tag>
                          ) : (
                            <Tag icon={<CloseCircleOutlined />} color="error" className="status-tag">
                              Sai
                            </Tag>
                          )}
                          <Tag color="blue" className="score-tag">{score}</Tag>
                        </div>
                      </div>

                      <div className="review-question-body">
                        <div className="review-question-content">
                          <div className="review-question-text">
                            <MarkdownViewer content={question.content || ""} className="exam-markdown-content" />
                          </div>
                        </div>

                        <div className="review-question-options">
                          {question.type === ExamQuestionType.SINGLE && (
                            <Radio.Group
                              value={answer?.selectedOptionIds?.[0]}
                              disabled
                              className="exam-radio-group review-radio-group"
                            >
                              {question.options?.map((option, optIdx) => {
                                // Check if this option is selected - compare both original and normalized IDs
                                const isSelected = item.selectedOptionIds.has(option.id) || 
                                                  item.selectedOptionIds.has(normalizeId(option.id));
                                
                                // Check if this option is correct - compare both original and normalized IDs
                                const isCorrectOption = item.correctOptionIds.has(option.id) ||
                                                        item.correctOptionIds.has(normalizeId(option.id));
                                
                                // Use answer.isCorrect to determine highlighting logic
                                const questionIsCorrect = item.isCorrect;
                                
                                // Only highlight: 1) correct answer (green), 2) selected wrong answer (red) if question is wrong
                                let optionClass = '';
                                let optionLabel = '';
                                
                                if (isCorrectOption) {
                                  // Đáp án đúng - luôn highlight xanh
                                  optionClass = isSelected ? 'correct-option selected-correct' : 'correct-option not-selected';
                                  optionLabel = isSelected ? '✓ Đáp án đúng (bạn đã chọn)' : '✓ Đáp án đúng';
                                } else if (isSelected && !questionIsCorrect) {
                                  // Đáp án sai nhưng đã chọn - chỉ highlight đỏ nếu câu hỏi sai
                                  optionClass = 'incorrect-selected';
                                  optionLabel = '✗ Đáp án sai (bạn đã chọn)';
                                }
                                // else: không highlight (option bình thường)
                                
                                return (
                                  <div key={option.id} className={`option-item review-option ${optionClass}`}>
                                    <Radio value={option.id} className="exam-radio">
                                      <span className="option-label">{String.fromCharCode(65 + optIdx)}.</span>
                                      <span className="option-text">{option.text}</span>
                                    </Radio>
                                    {optionLabel && (
                                      <span className={`option-status-label ${isCorrectOption ? 'correct-label' : 'incorrect-label'}`}>
                                        {optionLabel}
                                      </span>
                                    )}
                                    {isCorrectOption && (
                                      <CheckCircleOutlined className="correct-indicator" />
                                    )}
                                    {isSelected && !isCorrectOption && (
                                      <CloseCircleOutlined className="incorrect-indicator" />
                                    )}
                                  </div>
                                );
                              })}
                            </Radio.Group>
                          )}

                          {question.type === ExamQuestionType.MULTIPLE && (
                            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                              {question.options?.map((option, optIdx) => {
                                // Check if this option is selected - compare both original and normalized IDs
                                const isSelected = item.selectedOptionIds.has(option.id) || 
                                                  item.selectedOptionIds.has(normalizeId(option.id));
                                
                                // Check if this option is correct - compare both original and normalized IDs
                                const isCorrectOption = item.correctOptionIds.has(option.id) ||
                                                        item.correctOptionIds.has(normalizeId(option.id));
                                
                                // Use answer.isCorrect to determine highlighting logic
                                const questionIsCorrect = item.isCorrect;
                                
                                // Only highlight: 1) correct answer (green), 2) selected wrong answer (red) if question is wrong
                                let optionClass = '';
                                let optionLabel = '';
                                
                                if (isCorrectOption) {
                                  // Đáp án đúng - luôn highlight xanh
                                  optionClass = isSelected ? 'correct-option selected-correct' : 'correct-option not-selected';
                                  optionLabel = isSelected ? '✓ Đáp án đúng (bạn đã chọn)' : '✓ Đáp án đúng';
                                } else if (isSelected && !questionIsCorrect) {
                                  // Đáp án sai nhưng đã chọn - chỉ highlight đỏ nếu câu hỏi sai
                                  optionClass = 'incorrect-selected';
                                  optionLabel = '✗ Đáp án sai (bạn đã chọn)';
                                }
                                // else: không highlight (option bình thường)
                                
                                return (
                                  <div key={option.id} className={`option-item review-option ${optionClass}`}>
                                    <Checkbox
                                      checked={isSelected}
                                      disabled
                                      className="exam-checkbox"
                                    >
                                      <span className="option-label">{String.fromCharCode(65 + optIdx)}.</span>
                                      <span className="option-text">{option.text}</span>
                                    </Checkbox>
                                    {optionLabel && (
                                      <span className={`option-status-label ${isCorrectOption ? 'correct-label' : 'incorrect-label'}`}>
                                        {optionLabel}
                                      </span>
                                    )}
                                    {isCorrectOption && (
                                      <CheckCircleOutlined className="correct-indicator" />
                                    )}
                                    {isSelected && !isCorrectOption && (
                                      <CloseCircleOutlined className="incorrect-indicator" />
                                    )}
                                  </div>
                                );
                              })}
                            </Space>
                          )}

                          {question.type === ExamQuestionType.FILL_IN && (
                            <div className="review-fill-in">
                              <div className="review-answer-section">
                                <Text strong className="review-answer-label">Đáp án của bạn:</Text>
                                <Input.TextArea
                                  value={answer?.textAnswer || ""}
                                  disabled
                                  rows={3}
                                  className="review-textarea"
                                />
                              </div>
                              {question.textAnswers && question.textAnswers.length > 0 && (
                                <div className="review-answer-section">
                                  <Text strong className="review-answer-label correct">Đáp án đúng:</Text>
                                  <div className="review-correct-answers">
                                    {question.textAnswers.map((text, idx) => (
                                      <Tag key={idx} color="success" className="correct-answer-tag">
                                        {text}
                                      </Tag>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {question.explanation && (
                          <Alert 
                            type="info" 
                            message={<span className="explanation-title">📝 Ghi chú</span>} 
                            description={
                              <div className="explanation-text">
                                <MarkdownViewer content={question.explanation || ""} className="exam-markdown-explanation" />
                              </div>
                            } 
                            showIcon={false}
                            className="question-explanation review-explanation"
                          />
                        )}
                      </div>
                    </Card>
                  </ScrollAnimation>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExamResultPage;


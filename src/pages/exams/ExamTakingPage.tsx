import { Alert, Button, Card, Checkbox, Col, Input, Radio, Row, Segmented, Space, Spin, Typography, Badge, Divider } from "antd";
import { QuestionCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ExamTimer } from "../../components/exam/ExamTimer";
import QuestionNavigator from "../../components/exam/QuestionNavigator";
import { showNotification } from "../../components/common/Toaster";
import { ToasterType } from "../../enum/toaster";
import { useSelector } from "../../redux/store";
import { examService } from "../../services/examService";
import { AttemptAnswerPayload, ExamAttempt, ExamDetail, ExamQuestionType } from "../../types/exam";
import { RootState } from "../../redux/store";
import { Role } from "../../enum/user.enum";
import MarkdownViewer from "../../components/common/MarkdownViewer";
import "./ExamTakingPage.css";

const { Title, Paragraph } = Typography;

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

const transformExamDetail = (detail: ExamDetail) => {
  const questionIdMap: Record<string, string> = {};
  const optionIdMap: Record<string, Record<string, string>> = {};
  const questionOriginalIdMap: Record<string, string> = {};
  const optionOriginalIdMap: Record<string, Record<string, string>> = {};

  const normalizedQuestions = detail.questions.map((question, questionIndex) => {
    const rawQuestionIdCandidate =
      (question as any)?._id ?? (question as any)?.id ?? (question as any)?.questionId ?? question.originalId ?? `question-${questionIndex}`;
    const normalizedQuestionId = normalizeId(rawQuestionIdCandidate) || `question-${questionIndex}`;
    questionIdMap[normalizeId(rawQuestionIdCandidate) || normalizedQuestionId] = normalizedQuestionId;
    questionIdMap[normalizedQuestionId] = normalizedQuestionId;
    const originalQuestionId = normalizeId(rawQuestionIdCandidate) || normalizedQuestionId;
    questionOriginalIdMap[normalizedQuestionId] = originalQuestionId;

    const optionMap: Record<string, string> = {};
    const optionOriginalMap: Record<string, string> = {};
    const normalizedOptions = (question.options ?? []).map((option, optionIndex) => {
      const optionRawCandidate =
        option.id ?? (option as any)?._id ?? (option as any)?.optionId ?? (option as any)?.value ?? `${normalizedQuestionId}-option-${optionIndex}`;
      const normalizedOptionId = normalizeId(optionRawCandidate) || `${normalizedQuestionId}-option-${optionIndex}`;
      optionMap[normalizeId(optionRawCandidate) || normalizedOptionId] = normalizedOptionId;
      optionMap[normalizedOptionId] = normalizedOptionId;
      const originalOptionId = normalizeId(optionRawCandidate) || normalizedOptionId;
      optionOriginalMap[normalizedOptionId] = originalOptionId;
      return {
        ...option,
        id: normalizedOptionId,
      };
    });

    optionIdMap[normalizedQuestionId] = optionMap;
    optionOriginalIdMap[normalizedQuestionId] = optionOriginalMap;

    const normalizedCorrectAnswers = question.correctAnswers?.map((answerId, answerIndex) => {
      const rawAnswerId = normalizeId(answerId);
      return optionMap[rawAnswerId] ?? normalizedOptions[answerIndex]?.id ?? rawAnswerId;
    });

    return {
      ...question,
      _id: normalizedQuestionId,
      originalId: normalizeId(rawQuestionIdCandidate) || normalizedQuestionId,
      options: normalizedOptions,
      correctAnswers: normalizedCorrectAnswers,
    };
  });

  return {
    exam: {
      ...detail,
      questions: normalizedQuestions,
    },
    questionIdMap,
    optionIdMap,
    questionOriginalIdMap,
    optionOriginalIdMap,
  };
};

const ExamTakingPage: React.FC = () => {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [answersMap, setAnswersMap] = useState<Record<string, AttemptAnswerPayload>>({});
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const answersMapRef = useRef<Record<string, AttemptAnswerPayload>>({});
  useEffect(() => {
    answersMapRef.current = answersMap;
  }, [answersMap]);
  const [questionIdMap, setQuestionIdMap] = useState<Record<string, string>>({});
  const [optionIdMaps, setOptionIdMaps] = useState<Record<string, Record<string, string>>>({});
  const [attemptQuestionMap, setAttemptQuestionMap] = useState<Record<string, string>>({});
  const [questionOriginalIdMap, setQuestionOriginalIdMap] = useState<Record<string, string>>({});
  const [optionOriginalIdMaps, setOptionOriginalIdMaps] = useState<Record<string, Record<string, string>>>({});
  const [viewMode, setViewMode] = useState<"single" | "all">("single");

  const attemptIdFromUrl = searchParams.get("attemptId");

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!examId || !user?._id) return;
      try {
        const rawDetail = await examService.getExamDetail(examId);
        if (!mounted) return;
        const transformed = transformExamDetail(rawDetail);
        const optionMapState: Record<string, Record<string, string>> = { ...transformed.optionIdMap };
        const optionOriginalMapState: Record<string, Record<string, string>> = { ...transformed.optionOriginalIdMap };
        const questionMapState: Record<string, string> = { ...transformed.questionIdMap };
        const questionOriginalMapState: Record<string, string> = { ...transformed.questionOriginalIdMap };
        const attemptMap: Record<string, string> = {};
        Object.entries(questionMapState).forEach(([rawId, normalized]) => {
          attemptMap[rawId] = normalized;
        });
        transformed.exam.questions.forEach((question) => {
          if (question.originalId) {
            attemptMap[normalizeId(question.originalId)] = question._id;
          }
        });

        let data: ExamAttempt;
        if (attemptIdFromUrl) {
          data = await examService.getAttempt(examId, attemptIdFromUrl);
        } else {
          data = await examService.createAttempt(examId, {
            studentId: user._id,
            deviceInfo: { userAgent: window.navigator.userAgent },
          });
        }
        if (!mounted) return;

        const initialAnswers: Record<string, AttemptAnswerPayload> = {};
        data.answers?.forEach((answer) => {
          const rawQuestionId = normalizeId(answer.questionId);
          const normalizedQuestionId = attemptMap[rawQuestionId] ?? questionMapState[rawQuestionId] ?? rawQuestionId;
          if (!normalizedQuestionId) return;

          let optionMap = optionMapState[normalizedQuestionId];
          let optionOriginalMap = optionOriginalMapState[normalizedQuestionId];
          if (!optionMap) {
            optionMap = {};
            optionMapState[normalizedQuestionId] = optionMap;
          }
          if (!optionOriginalMap) {
            optionOriginalMap = {};
            optionOriginalMapState[normalizedQuestionId] = optionOriginalMap;
          }

          if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0 && Object.keys(optionMap).length === 0) {
            const question = transformed.exam.questions.find(
              (q) => normalizeId(q._id) === normalizedQuestionId || normalizeId(q.originalId) === normalizedQuestionId,
            );
            if (question?.options) {
              const nextMap: Record<string, string> = {};
              const nextOriginalMap: Record<string, string> = optionOriginalMapState[normalizedQuestionId] ?? {};
              question.options.forEach((option) => {
                const rawOptionId = normalizeId(option.id);
                if (rawOptionId) {
                  nextMap[rawOptionId] = rawOptionId;
                  if (!nextOriginalMap[rawOptionId]) {
                    nextOriginalMap[rawOptionId] = rawOptionId;
                  }
                }
              });
              optionMapState[normalizedQuestionId] = nextMap;
              optionOriginalMapState[normalizedQuestionId] = nextOriginalMap;
              optionMap = nextMap;
              optionOriginalMap = nextOriginalMap;
            }
          }

          const normalizedOptionIds = (answer.selectedOptionIds ?? []).map((optionId) => {
            const rawOptionId = normalizeId(optionId);
            return optionMap?.[rawOptionId] ?? rawOptionId;
          });

          initialAnswers[normalizedQuestionId] = {
            questionId: normalizedQuestionId,
            selectedOptionIds: normalizedOptionIds,
            textAnswer: answer.textAnswer,
          };
        });

        setExam(transformed.exam);
        setQuestionIdMap(questionMapState);
        setOptionIdMaps(optionMapState);
        setAttemptQuestionMap(attemptMap);
        setQuestionOriginalIdMap(questionOriginalMapState);
        setOptionOriginalIdMaps(optionOriginalMapState);
        setAttempt(data);
        setAnswersMap(initialAnswers);
        if (!attemptIdFromUrl && data?._id) {
          navigate(`/exams/${examId}/take?attemptId=${data._id}`, { replace: true });
        }
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải dữ liệu bài kiểm tra";
        showNotification(ToasterType.error, "Exam", message);
      }
    };
    init();
    return () => {
      mounted = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [attemptIdFromUrl, examId, navigate, user?._id]);

  const buildBackendAnswers = useCallback(
    (answers: Record<string, AttemptAnswerPayload>) => {
      return Object.values(answers).map((answer) => {
        const normalizedQuestionId = normalizeId(answer.questionId);
        const originalQuestionId = questionOriginalIdMap[normalizedQuestionId] ?? normalizedQuestionId;
        let originalOptionIds: string[] | undefined;
        if (answer.selectedOptionIds) {
          const optionOriginalMap = optionOriginalIdMaps[normalizedQuestionId] ?? {};
          originalOptionIds = answer.selectedOptionIds.map((optionId) => {
            const normalizedOptionId = normalizeId(optionId);
            return optionOriginalMap[normalizedOptionId] ?? normalizedOptionId;
          });
        }
        return {
          questionId: originalQuestionId,
          selectedOptionIds: originalOptionIds,
          textAnswer: answer.textAnswer,
        };
      });
    },
    [optionOriginalIdMaps, questionOriginalIdMap],
  );

  const persistAnswers = useCallback(
    async (answers: Record<string, AttemptAnswerPayload>) => {
      if (!examId || !attempt) return;
      const payload = { answers: buildBackendAnswers(answers) };
      try {
        setSaving(true);
        const updated = await examService.saveAttemptProgress(examId, attempt._id, payload);
        setAttempt(updated);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể lưu tiến độ";
        showNotification(ToasterType.error, "Exam", message);
      } finally {
        setSaving(false);
      }
    },
    [attempt, buildBackendAnswers, examId],
  );

  const scheduleSave = useCallback(
    (answers: Record<string, AttemptAnswerPayload>) => {
      if (!examId || !attempt) return;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null;
        void persistAnswers(answers);
      }, 800);
    },
    [attempt, examId, persistAnswers],
  );

  const flushPendingSave = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
      await persistAnswers(answersMapRef.current ?? {});
    }
  }, [persistAnswers]);

  const handleAnswerChange = (
    questionId: string,
    updater: (prev: AttemptAnswerPayload | undefined) => Partial<AttemptAnswerPayload>,
  ) => {
    if (!questionId) {
      showNotification(ToasterType.error, "Exam", "Không xác định được câu hỏi");
      return;
    }
    setAnswersMap((prev) => {
      const normalizedId = normalizeId(questionId);
      const previousAnswer = prev[normalizedId];
      const updatedAnswer: AttemptAnswerPayload = {
        questionId: normalizedId,
        selectedOptionIds: previousAnswer?.selectedOptionIds,
        textAnswer: previousAnswer?.textAnswer,
        ...updater(previousAnswer),
      };
      const next = {
        ...prev,
        [normalizedId]: updatedAnswer,
      };
      answersMapRef.current = next;
      scheduleSave(next);
      return next;
    });
  };

  const handleSubmit = async (auto = false) => {
    if (!examId || !attempt || !exam) return;
    if (!auto) {
      const unanswered = exam.questions.filter((q) => !answeredQuestionIds.has(q._id));
      if (unanswered.length > 0) {
        showNotification(ToasterType.warning, "Exam", `Bạn còn ${unanswered.length} câu chưa trả lời.`);
        return;
      }
    }
    try {
      await flushPendingSave();
      const result = await examService.submitAttempt(examId, attempt._id, auto ? { forceSubmit: true } : undefined);
      navigate(`/exams/${examId}/result/${result._id}`);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        showNotification(ToasterType.error, "Exam", "Không tìm thấy bài kiểm tra. Có thể đề đã bị xoá hoặc đổi ID.");
        return;
      }
      const message = error?.response?.data?.message || "Không thể nộp bài";
      showNotification(ToasterType.error, "Exam", message);
    }
  };

  const durationSeconds = useMemo(() => {
    if (!exam?.config?.durationMinutes) return 0;
    if (!attempt?.startedAt) return exam.config.durationMinutes * 60;
    const elapsed = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
    const remaining = exam.config.durationMinutes * 60 - elapsed;
    return remaining > 0 ? remaining : 0;
  }, [exam, attempt]);

  const isAdmin = user?.role === Role.ADMIN;

  const answeredQuestionIds = useMemo(() => {
    return new Set(
      Object.values(answersMap)
        .filter((answer) => {
          if (!answer) return false;
          if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) return true;
          if (answer.textAnswer && answer.textAnswer.trim() !== "") return true;
          return false;
        })
        .map((answer) => answer.questionId),
    );
  }, [answersMap]);

  if (!exam) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
        <Spin />
      </div>
    );
  }

  const handleSingleChange = (questionId: string, optionId: string) => {
    if (!questionId) return;
    handleAnswerChange(questionId, () => ({ selectedOptionIds: [optionId], textAnswer: undefined }));
  };

  const handleMultiToggle = (questionId: string, optionId: string, currentAnswer?: AttemptAnswerPayload) => {
    if (!questionId) return;
    const current = new Set(currentAnswer?.selectedOptionIds ?? []);
    if (current.has(optionId)) {
      current.delete(optionId);
    } else {
      current.add(optionId);
    }
    handleAnswerChange(questionId, () => ({ selectedOptionIds: Array.from(current), textAnswer: undefined }));
  };

  const handleFillChange = (questionId: string, value: string) => {
    if (!questionId) return;
    handleAnswerChange(questionId, () => ({ textAnswer: value, selectedOptionIds: undefined }));
  };

  const renderQuestionBody = (question: ExamDetail["questions"][number], answer?: AttemptAnswerPayload) => {
    const questionId = question?._id ?? "";
    return (
      <div className="question-body">
        <div className="question-content">
          <div className="question-text">
            <MarkdownViewer content={question.content || ""} className="exam-markdown-content" />
          </div>
        </div>

        <div className="question-options">
          {question.type === ExamQuestionType.SINGLE && (
            <Radio.Group
              value={answer?.selectedOptionIds?.[0]}
              onChange={(event) => handleSingleChange(questionId, event.target.value)}
              className="exam-radio-group"
            >
              {question.options?.map((option, idx) => (
                <div key={option.id} className="option-item">
                  <Radio value={option.id} className="exam-radio">
                    <span className="option-label">{String.fromCharCode(65 + idx)}.</span>
                    <span className="option-text">{option.text}</span>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          )}

          {question.type === ExamQuestionType.MULTIPLE && (
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {question.options?.map((option, idx) => (
                <div key={option.id} className="option-item">
                  <Checkbox
                    checked={answer?.selectedOptionIds?.includes(option.id) ?? false}
                    onChange={() => handleMultiToggle(questionId, option.id, answer)}
                    className="exam-checkbox"
                  >
                    <span className="option-label">{String.fromCharCode(65 + idx)}.</span>
                    <span className="option-text">{option.text}</span>
                  </Checkbox>
                </div>
              ))}
            </Space>
          )}

          {question.type === ExamQuestionType.FILL_IN && (
            <Input.TextArea
              rows={5}
              value={answer?.textAnswer}
              onChange={(event) => handleFillChange(questionId, event.target.value)}
              placeholder="Nhập câu trả lời của bạn..."
              className="exam-textarea"
            />
          )}
        </div>

        {question.explanation && isAdmin && (
          <Alert 
            type="info" 
            message={<span className="explanation-title">📝 Ghi chú</span>} 
            description={
              <div className="explanation-text">
                <MarkdownViewer content={question.explanation || ""} className="exam-markdown-explanation" />
              </div>
            } 
            showIcon={false}
            className="question-explanation"
          />
        )}
      </div>
    );
  };

  const renderSingleQuestion = () => {
    const question = exam.questions[currentIndex];
    const questionId = question?._id ?? "";
    const answer = questionId ? answersMap[questionId] || { questionId } : { questionId: "" };
    const isAnswered = answeredQuestionIds.has(questionId);

    return (
      <div className="single-question-view">
        <div className="question-header">
          <div className="question-number-badge">
            <FileTextOutlined className="question-icon" />
            <span className="question-number-text">
              Câu {currentIndex + 1} / {exam.questions.length}
            </span>
            {isAnswered && (
              <div className="answered-indicator">
                <CheckCircleOutlined className="answered-check-icon" />
                <span className="answered-label">Đã trả lời</span>
              </div>
            )}
          </div>
        </div>

        <Card className="question-card">
          {renderQuestionBody(question, answer)}
        </Card>

        <div className="question-navigation">
          <Button 
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} 
            disabled={currentIndex === 0}
            className="nav-button prev-button"
            size="large"
          >
            ← Câu trước
          </Button>
          <Button
            type="primary"
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, exam.questions.length - 1))}
            disabled={currentIndex === exam.questions.length - 1}
            className="nav-button next-button"
            size="large"
          >
            Câu tiếp theo →
          </Button>
          <Button 
            danger 
            onClick={() => handleSubmit(false)}
            className="nav-button submit-button"
            size="large"
          >
            Nộp bài
          </Button>
        </div>
        {saving && (
          <div className="saving-indicator">
            <Spin size="small" />
            <span>Đang lưu...</span>
          </div>
        )}
      </div>
    );
  };

  const renderAllQuestions = () => (
    <div className="all-questions-view">
      <div className="all-questions-header">
        <Title level={4} className="all-questions-title">
          <QuestionCircleOutlined /> Tất cả {exam.questions.length} câu hỏi
        </Title>
      </div>

      <div className="questions-list">
        {exam.questions.map((item, index) => {
          const qId = item?._id ?? "";
          const answer = qId ? answersMap[qId] || { questionId: qId } : { questionId: "" };
          const isAnswered = answeredQuestionIds.has(qId);
          return (
            <Card 
              key={qId || index} 
              className={`question-item-card ${isAnswered ? 'answered' : ''}`}
            >
              <div className="question-item-header">
                <Badge 
                  count={index + 1} 
                  className="question-item-number"
                  style={{ backgroundColor: isAnswered ? "#52c41a" : "var(--accent-color)" }}
                />
                {isAnswered && (
                  <CheckCircleOutlined className="answered-icon" />
                )}
              </div>
              {renderQuestionBody(item, answer)}
            </Card>
          );
        })}
      </div>

      {saving && (
        <div className="saving-indicator">
          <Spin size="small" />
          <span>Đang lưu...</span>
        </div>
      )}
      <div className="submit-section">
        <Button 
          danger 
          onClick={() => handleSubmit(false)}
          size="large"
          className="submit-all-button"
        >
          Nộp bài
        </Button>
      </div>
    </div>
  );

  return (
    <div className="exam-taking-page">
      <div className="exam-container">
        {/* Main Content Area */}
        <div className="exam-main-content">
          <Card className="exam-header-card">
            <div className="exam-header">
              <div className="exam-title-section">
                <Title level={2} className="exam-title">
                  {exam.title}
                </Title>
                <div className="exam-stats">
                  <div className="stat-item">
                    <span className="stat-label">Tổng số câu</span>
                    <div className="stat-badge total">
                      {exam.questions.length}
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Đã trả lời</span>
                    <div className="stat-badge answered">
                      {answeredQuestionIds.size}
                    </div>
                  </div>
                </div>
              </div>
              <Segmented
                size="large"
                value={viewMode}
                onChange={(value) => setViewMode(value as "single" | "all")}
                options={[
                  { label: "📄 Từng câu", value: "single" },
                  { label: "📋 Tất cả", value: "all" },
                ]}
                className="view-mode-toggle"
              />
            </div>
          </Card>

          <Card className="exam-content-card">
            {viewMode === "single" ? renderSingleQuestion() : renderAllQuestions()}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="exam-sidebar">
          <Card className="timer-card">
            <div className="timer-header">
              <ClockCircleOutlined className="timer-icon" />
              <span className="timer-label">Thời gian còn lại</span>
            </div>
            <ExamTimer durationSeconds={durationSeconds} onExpire={() => handleSubmit(true)} running />
          </Card>

          <Card className="navigator-card" title={
            <div className="navigator-title">
              <QuestionCircleOutlined />
              <span>Danh sách câu hỏi</span>
            </div>
          }>
            <QuestionNavigator
              questions={exam.questions}
              currentIndex={currentIndex}
              onSelect={setCurrentIndex}
              answeredQuestionIds={answeredQuestionIds}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamTakingPage;


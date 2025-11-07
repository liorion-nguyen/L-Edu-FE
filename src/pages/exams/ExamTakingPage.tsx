import { Alert, Button, Card, Checkbox, Col, Input, Radio, Row, Space, Spin, Typography } from "antd";
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

  const normalizedQuestions = detail.questions.map((question, questionIndex) => {
    const rawQuestionId = question._id;
    const normalizedQuestionId = normalizeId(rawQuestionId) || `question-${questionIndex}`;
    questionIdMap[normalizeId(rawQuestionId) || normalizedQuestionId] = normalizedQuestionId;
    questionIdMap[normalizedQuestionId] = normalizedQuestionId;

    const optionMap: Record<string, string> = {};
    const normalizedOptions = (question.options ?? []).map((option, optionIndex) => {
      const rawOptionId = option.id ?? (option as any)?._id ?? `${normalizedQuestionId}-option-${optionIndex}`;
      const normalizedOptionId = normalizeId(rawOptionId) || `${normalizedQuestionId}-option-${optionIndex}`;
      optionMap[normalizeId(rawOptionId) || normalizedOptionId] = normalizedOptionId;
      optionMap[normalizedOptionId] = normalizedOptionId;
      return {
        ...option,
        id: normalizedOptionId,
      };
    });

    optionIdMap[normalizedQuestionId] = optionMap;

    const normalizedCorrectAnswers = question.correctAnswers?.map((answerId, answerIndex) => {
      const rawAnswerId = normalizeId(answerId);
      return optionMap[rawAnswerId] ?? normalizedOptions[answerIndex]?.id ?? rawAnswerId;
    });

    return {
      ...question,
      _id: normalizedQuestionId,
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
  const [questionIdMap, setQuestionIdMap] = useState<Record<string, string>>({});
  const [optionIdMaps, setOptionIdMaps] = useState<Record<string, Record<string, string>>>({});
  const [attemptQuestionMap, setAttemptQuestionMap] = useState<Record<string, string>>({});

  const attemptIdFromUrl = searchParams.get("attemptId");

  const loadExam = useCallback(async () => {
    if (!examId) return;
    try {
      const rawDetail = await examService.getExamDetail(examId);
      const transformed = transformExamDetail(rawDetail);
      setExam(transformed.exam);
      setQuestionIdMap(transformed.questionIdMap);
      setOptionIdMaps(transformed.optionIdMap);
      // map original ids to normalized ids for future lookups
      const map: Record<string, string> = {};
      Object.entries(transformed.questionIdMap).forEach(([rawId, normalized]) => {
        map[rawId] = normalized;
      });
      transformed.exam.questions.forEach((question) => {
        if (question.originalId) {
          map[question.originalId] = question._id;
        }
      });
      setAttemptQuestionMap(map);
      return transformed.exam;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể tải đề thi";
      showNotification(ToasterType.error, "Exam", message);
      return null;
    }
  }, [examId]);

  const loadAttempt = useCallback(
    async (detail: ExamDetail | null) => {
      if (!examId || !user?._id) return;
      try {
        const data = attemptIdFromUrl
          ? await examService.getAttempt(examId, attemptIdFromUrl)
          : await examService.createAttempt(examId, {
              studentId: user._id,
              deviceInfo: { userAgent: window.navigator.userAgent },
            });
        setAttempt(data);
        const initialAnswers: Record<string, AttemptAnswerPayload> = {};
        data.answers?.forEach((answer) => {
          const rawQuestionId = normalizeId(answer.questionId);
          const normalizedQuestionId = attemptQuestionMap[rawQuestionId] ?? questionIdMap[rawQuestionId] ?? rawQuestionId;
          if (!normalizedQuestionId) return;

          const optionMap = optionIdMaps[normalizedQuestionId] ?? {};
          if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0 && Object.keys(optionMap).length === 0) {
            const question = detail?.questions.find((q) => normalizeId(q._id) === normalizedQuestionId || normalizeId(q.originalId) === normalizedQuestionId);
            if (question?.options) {
              const nextMap: Record<string, string> = {};
              question.options.forEach((option) => {
                const rawOptionId = normalizeId(option.id);
                nextMap[rawOptionId] = rawOptionId;
              });
              optionIdMaps[normalizedQuestionId] = nextMap;
            }
          }
          const normalizedOptionIds = (answer.selectedOptionIds ?? []).map((optionId) => {
            const rawOptionId = normalizeId(optionId);
            return optionMap[rawOptionId] ?? rawOptionId;
          });

          initialAnswers[normalizedQuestionId] = {
            questionId: normalizedQuestionId,
            selectedOptionIds: normalizedOptionIds,
            textAnswer: answer.textAnswer,
          };
        });
        setAnswersMap(initialAnswers);
        if (!attemptIdFromUrl) {
          navigate(`/exams/${examId}/take?attemptId=${data._id}`, { replace: true });
        }
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải phiên làm bài";
        showNotification(ToasterType.error, "Exam", message);
      }
    },
    [attemptIdFromUrl, examId, navigate, optionIdMaps, questionIdMap, user?._id],
  );

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const detail = await loadExam();
      if (detail && mounted) {
        await loadAttempt(detail);
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
  }, [loadExam, loadAttempt]);

  const scheduleSave = (payload: { answers: AttemptAnswerPayload[] }) => {
    if (!examId || !attempt) return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
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
    }, 800);
  };

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
      scheduleSave({ answers: Object.values(next) });
      return next;
    });
  };

  const handleSubmit = async (auto = false) => {
    if (!examId || !attempt) return;
    try {
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

  const question = exam.questions[currentIndex];
  const questionId = question?._id ?? "";
  const answer = questionId ? answersMap[questionId] || { questionId } : { questionId: "" };

  const handleSingleChange = (optionId: string) => {
    if (!questionId) return;
    handleAnswerChange(questionId, () => ({ selectedOptionIds: [optionId], textAnswer: undefined }));
  };

  const handleMultiToggle = (optionId: string) => {
    if (!questionId) return;
    const current = new Set(answer.selectedOptionIds ?? []);
    if (current.has(optionId)) {
      current.delete(optionId);
    } else {
      current.add(optionId);
    }
    handleAnswerChange(questionId, () => ({ selectedOptionIds: Array.from(current), textAnswer: undefined }));
  };

  const handleFillChange = (value: string) => {
    if (!questionId) return;
    handleAnswerChange(questionId, () => ({ textAnswer: value, selectedOptionIds: undefined }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Title level={4}>{exam.title}</Title>
                <Paragraph type="secondary">Câu {currentIndex + 1} / {exam.questions.length}</Paragraph>
                <Paragraph>{question.content}</Paragraph>

                {question.type === ExamQuestionType.SINGLE && (
                  <Radio.Group
                    value={answer.selectedOptionIds?.[0]}
                    onChange={(event) => handleSingleChange(event.target.value)}
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {question.options?.map((option) => (
                      <Radio key={option.id} value={option.id}>
                        {option.text}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}

                {question.type === ExamQuestionType.MULTIPLE && (
                  <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    {question.options?.map((option) => (
                      <Checkbox
                        key={option.id}
                        checked={answer.selectedOptionIds?.includes(option.id) ?? false}
                        onChange={() => handleMultiToggle(option.id)}
                      >
                        {option.text}
                      </Checkbox>
                    ))}
                  </Space>
                )}

                {question.type === ExamQuestionType.FILL_IN && (
                  <Input.TextArea
                    rows={3}
                    value={answer.textAnswer}
                    onChange={(event) => handleFillChange(event.target.value)}
                    placeholder="Nhập câu trả lời"
                  />
                )}

                {question.explanation && (
                  <Alert type="info" message="Ghi chú" description={question.explanation} showIcon />
                )}

                <Space style={{ marginTop: 16 }}>
                  <Button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} disabled={currentIndex === 0}>
                    Câu trước
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, exam.questions.length - 1))}
                    disabled={currentIndex === exam.questions.length - 1}
                  >
                    Câu tiếp theo
                  </Button>
                  <Button danger onClick={() => handleSubmit(false)}>
                    Nộp bài
                  </Button>
                </Space>
                {saving && <Paragraph type="secondary">Đang lưu...</Paragraph>}
              </Space>
            </Card>
          </Space>
        </Col>
        <Col xs={24} md={8}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card>
              <ExamTimer durationSeconds={durationSeconds} onExpire={() => handleSubmit(true)} running />
            </Card>
            <Card title="Danh sách câu hỏi">
              <QuestionNavigator
                questions={exam.questions}
                currentIndex={currentIndex}
                onSelect={setCurrentIndex}
                answeredQuestionIds={answeredQuestionIds}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ExamTakingPage;


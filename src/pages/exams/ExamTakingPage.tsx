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
    if (!examId || !attempt) return;
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


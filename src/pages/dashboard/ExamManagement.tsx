import {
  BookOutlined,
  CheckCircleTwoTone,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  ImportOutlined,
  SendOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../redux/store";
import { fetchExams, fetchExamDetail, createExam, publishExam, clearSelectedExam, updateExam } from "../../redux/slices/exams";
import { ExamQuestionType, ExamSummary, CreateExamPayload, ExamVisibility, ExamDetail, ExamQuestion } from "../../types/exam";
import { QuestionForm } from "../../components/exam/QuestionForm";
import { courseService, CourseListResponse } from "../../services/courseService";
import { RootState } from "../../redux/store";
import { nanoid } from "nanoid";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { sessionService, Session } from "../../services/sessionService";
import { examService } from "../../services/examService";

const { Title, Text } = Typography;

const JSON_EXAMPLE = `[
  {
    "type": "SINGLE",
    "content": "Câu hỏi trắc nghiệm 1?",
    "explanation": "Giải thích đáp án đúng",
    "options": [
      { "text": "Đáp án A", "isCorrect": false },
      { "text": "Đáp án B", "isCorrect": true }
    ],
    "points": 1,
    "tags": ["chương-1"]
  },
  {
    "type": "MULTIPLE",
    "content": "Câu hỏi chọn nhiều đáp án?",
    "explanation": "Có thể chọn nhiều hơn một đáp án",
    "options": [
      { "text": "Lựa chọn 1", "isCorrect": true },
      { "text": "Lựa chọn 2", "isCorrect": true },
      { "text": "Lựa chọn 3", "isCorrect": false }
    ],
    "points": 2,
    "tags": ["chương-2"]
  },
  {
    "type": "FILL_IN",
    "content": "Nhập nội dung cần điền",
    "explanation": "Chấp nhận nhiều câu trả lời tương đương",
    "textAnswers": ["đáp án 1", "đáp án 2"],
    "points": 1.5,
    "tags": ["fill"]
  }
]`;

const visibilityTagColor: Record<ExamVisibility, string> = {
  [ExamVisibility.DRAFT]: "default",
  [ExamVisibility.PUBLISHED]: "success",
  [ExamVisibility.ARCHIVED]: "warning",
};

const columnsDefinition = (
  onView: (record: ExamSummary) => void,
  onPublish: (record: ExamSummary) => void,
  onEdit: (record: ExamSummary) => void,
) => [
  {
    title: "Bài kiểm tra",
    dataIndex: "title",
    key: "title",
    render: (text: string) => (
      <Space>
        <BookOutlined />
        <span style={{ fontWeight: 600 }}>{text}</span>
      </Space>
    ),
  },
  {
    title: "Khoá học",
    dataIndex: "courseId",
    key: "courseId",
    render: (courseId: string) => <Tag color="blue">{courseId}</Tag>,
  },
  {
    title: "Thời lượng",
    dataIndex: ["config", "durationMinutes"],
    key: "duration",
    render: (duration: number) => (
      <Space>
        <ClockCircleOutlined />
        {duration} phút
      </Space>
    ),
  },
  {
    title: "Điểm tối đa",
    dataIndex: "totalPoints",
    key: "totalPoints",
  },
  {
    title: "Trạng thái",
    dataIndex: "visibility",
    key: "visibility",
    render: (visibility: ExamVisibility) => <Tag color={visibilityTagColor[visibility]}>{visibility}</Tag>,
  },
  {
    key: "actions",
    render: (_: unknown, record: ExamSummary) => (
      <Space>
        <Button size="small" icon={<EyeOutlined />} onClick={() => onView(record)}>
          Xem
        </Button>
        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
          Chỉnh sửa
        </Button>
        {record.visibility === ExamVisibility.DRAFT && (
          <Button size="small" type="primary" icon={<SendOutlined />} onClick={() => onPublish(record)}>
            Phát hành
          </Button>
        )}
      </Space>
    ),
  },
];

const normalizeQuestions = (values: any[]): CreateExamPayload["questions"] => {
  return values.map((question, index) => {
    if (question.type === ExamQuestionType.FILL_IN) {
      return {
        type: question.type,
        content: question.content,
        textAnswers: question.textAnswers?.filter(Boolean) ?? [],
        explanation: question.explanation,
        points: Number(question.points) || 0,
        tags: question.tags?.filter(Boolean) ?? [],
        order: index,
      };
    }

    const options = (question.options ?? []).map((option: any) => ({
      id: option.id ?? nanoid(),
      text: option.text,
      isCorrect: Boolean(option.isCorrect),
    })) as Array<{ id: string; text: string; isCorrect: boolean }>;

    const correctAnswers = options
      .filter((opt: { id: string; text: string; isCorrect: boolean }) => opt.isCorrect)
      .map((opt: { id: string; text: string; isCorrect: boolean }) => opt.id);

    return {
      type: question.type,
      content: question.content,
      options,
      correctAnswers,
      explanation: question.explanation,
      points: Number(question.points) || 0,
      tags: question.tags?.filter(Boolean) ?? [],
      order: index,
    };
  });
};

const ExamManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslationWithRerender();
  const { items, loading, selectedExam } = useSelector((state: RootState) => state.exams);
  const { user } = useSelector((state: RootState) => state.auth);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [courses, setCourses] = useState<CourseListResponse["data"]>([]);
  const [courseSessions, setCourseSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [isPrefilling, setIsPrefilling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jsonInput, setJsonInput] = useState<string>(JSON_EXAMPLE);
  const [isApplyingJson, setIsApplyingJson] = useState(false);
  const [form] = Form.useForm();
  const selectedCourseId = Form.useWatch("courseId", form);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseService.getAllCourses({ limit: 100 });
      if (response?.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchExams(undefined));
    fetchCourses();
  }, [dispatch, fetchCourses]);

  useEffect(() => {
    if (!selectedCourseId) {
      setCourseSessions([]);
      form.setFieldsValue({ sessionIds: [] });
      return;
    }

    const loadSessions = async () => {
      try {
        setSessionsLoading(true);
        const response = await sessionService.getSessions({ courseId: selectedCourseId, limit: 200 });
        setCourseSessions(response.sessions ?? []);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
        message.error("Không thể tải danh sách buổi học cho khóa này");
        setCourseSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };

    loadSessions();
  }, [selectedCourseId, form]);

  const handleOpenCreate = () => {
    form.resetFields();
    setModalMode("create");
    setEditingExamId(null);
    setIsPrefilling(false);
    setJsonInput(JSON_EXAMPLE);
    setCreateModalVisible(true);
  };

  const handleViewDetail = useCallback(async (record: ExamSummary) => {
    await dispatch(fetchExamDetail(record._id));
    setDetailDrawerVisible(true);
  }, [dispatch]);

  const handlePublish = useCallback(async (record: ExamSummary) => {
    await dispatch(publishExam(record._id));
  }, [dispatch]);

  const handleOpenEdit = useCallback(async (record: ExamSummary) => {
    form.resetFields();
    setModalMode("edit");
    setEditingExamId(record._id);
    setCreateModalVisible(true);
    setIsPrefilling(true);
    try {
      const detail: ExamDetail = await examService.getExamDetail(record._id);
      const questionFields = detail.questions.map((question, index) => {
        if (question.type === ExamQuestionType.FILL_IN) {
          const answers = question.textAnswers && question.textAnswers.length > 0 ? question.textAnswers : [""];
          return {
            type: question.type,
            content: question.content,
            textAnswers: answers,
            explanation: question.explanation,
            points: question.points,
            tags: question.tags,
            order: question.order ?? index,
          };
        }

        const options = (question.options ?? []).map((option) => {
          const optionId = option.id ?? nanoid();
          const isCorrect = (question.correctAnswers ?? []).includes(option.id ?? optionId);
          return {
            id: optionId,
            text: option.text,
            isCorrect,
          };
        });

        return {
          type: question.type,
          content: question.content,
          options: options.length > 0 ? options : [{ id: nanoid(), text: "", isCorrect: false }],
          explanation: question.explanation,
          points: question.points,
          tags: question.tags,
          order: question.order ?? index,
        };
      });

      form.setFieldsValue({
        title: detail.title,
        description: detail.description,
        courseId: detail.courseId,
        sessionIds: detail.sessionIds ?? [],
        durationMinutes: detail.config.durationMinutes,
        startTime: detail.config.startTime ? dayjs(detail.config.startTime) : undefined,
        endTime: detail.config.endTime ? dayjs(detail.config.endTime) : undefined,
        shuffleQuestions: detail.config.shuffleQuestions ?? false,
        shuffleOptions: detail.config.shuffleOptions ?? false,
        allowBacktrack: detail.config.allowBacktrack ?? true,
        autoSubmit: detail.config.autoSubmit ?? true,
        passingScore: detail.config.passingScore ?? 0,
        questions: questionFields,
      });
      setJsonInput(JSON.stringify(questionFields, null, 2));
    } catch (error) {
      message.error("Không thể tải dữ liệu bài kiểm tra để chỉnh sửa");
      setCreateModalVisible(false);
      setEditingExamId(null);
      setModalMode("create");
    } finally {
      setIsPrefilling(false);
    }
  }, [form]);

  const handleCloseModal = useCallback(() => {
    setCreateModalVisible(false);
    setModalMode("create");
    setEditingExamId(null);
    setIsPrefilling(false);
    setJsonInput(JSON_EXAMPLE);
    form.resetFields();
  }, [form]);

  const handleApplyJson = useCallback(async () => {
    setIsApplyingJson(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const questionsInput: any[] = Array.isArray(parsed) ? parsed : parsed?.questions;

      if (!Array.isArray(questionsInput)) {
        throw new Error("Dữ liệu JSON phải là một mảng câu hỏi hoặc { questions: [] }");
      }

      const mapped = questionsInput.map((q, index) => {
        const type: ExamQuestionType =
          q.type && Object.values(ExamQuestionType).includes(q.type) ? q.type : ExamQuestionType.SINGLE;
        const common = {
          content: q.content ?? "",
          explanation: q.explanation ?? "",
          points: typeof q.points === "number" ? q.points : Number(q.points) || 1,
          tags: q.tags ?? q.labels ?? [],
          order: q.order ?? index,
        };

        if (type === ExamQuestionType.FILL_IN) {
          const answers = q.textAnswers ?? q.answers ?? q.acceptableAnswers ?? [];
          return {
            type,
            ...common,
            textAnswers: answers.length > 0 ? answers : [""],
          };
        }

        const optionsSource = q.options ?? [];
        const options =
          optionsSource.length > 0
            ? optionsSource.map((opt: any, optIdx: number) => ({
                id: opt.id ?? nanoid(),
                text: opt.text ?? `Lựa chọn ${optIdx + 1}`,
                isCorrect: Boolean(opt.isCorrect),
              }))
            : [
                { id: nanoid(), text: "Đáp án A", isCorrect: true },
                { id: nanoid(), text: "Đáp án B", isCorrect: false },
              ];

        return {
          type,
          ...common,
          options,
        };
      });

      form.setFieldsValue({ questions: mapped });
      message.success("Đã nhập câu hỏi từ JSON");
    } catch (error) {
      console.error("Failed to apply questions from JSON", error);
      message.error((error as Error).message || "JSON không hợp lệ, vui lòng kiểm tra lại");
    } finally {
      setIsApplyingJson(false);
    }
  }, [form, jsonInput]);

  const handleSubmitExam = useCallback(async () => {
    const values = await form.validateFields();
    const questions = normalizeQuestions(values.questions || []);

    const selectedCourse = courses.find((course) => course._id === values.courseId);
    let resolvedInstructorId: unknown = user?._id ?? selectedCourse?.instructorId ?? (selectedCourse as any)?.instructor?._id;

    if (resolvedInstructorId && typeof resolvedInstructorId === "object") {
      resolvedInstructorId = (resolvedInstructorId as { _id?: string })._id ?? String(resolvedInstructorId);
    }

    const instructorId = typeof resolvedInstructorId === "string" ? resolvedInstructorId : undefined;

    if (!instructorId) {
      message.error("Không xác định được giảng viên phụ trách. Vui lòng thử lại hoặc liên hệ quản trị viên.");
      return;
    }

    const payload: CreateExamPayload = {
      title: values.title,
      description: values.description,
      courseId: values.courseId,
      sessionIds: values.sessionIds,
      instructorId,
      config: {
        durationMinutes: values.durationMinutes,
        startTime: values.startTime ? dayjs(values.startTime).toISOString() : undefined,
        endTime: values.endTime ? dayjs(values.endTime).toISOString() : undefined,
        shuffleQuestions: values.shuffleQuestions,
        shuffleOptions: values.shuffleOptions,
        allowBacktrack: values.allowBacktrack,
        autoSubmit: values.autoSubmit,
        passingScore: values.passingScore,
      },
      questions,
    };

    try {
      setIsSubmitting(true);
      if (editingExamId) {
        await dispatch(updateExam({ examId: editingExamId, payload }));
      } else {
        await dispatch(createExam(payload));
      }
      setCreateModalVisible(false);
      setModalMode("create");
      setEditingExamId(null);
      form.resetFields();
    } finally {
      setIsSubmitting(false);
    }
  }, [courses, dispatch, editingExamId, form, user]);

  const columns = useMemo(
    () => columnsDefinition(handleViewDetail, handlePublish, handleOpenEdit),
    [handleViewDetail, handlePublish, handleOpenEdit],
  );

  const questionsForDrawer: ExamQuestion[] = selectedExam?.questions ?? [];

  const answeredCount = questionsForDrawer.length;

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Quản lý bài kiểm tra</Title>
          <Text type="secondary">
            Theo dõi, tạo mới và cấu hình bài kiểm tra cho từng khoá học. {t("common.total")}: {items.length}
          </Text>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<FileAddOutlined />} onClick={handleOpenCreate}>
              Tạo bài kiểm tra
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Table
          rowKey="_id"
          columns={columns as any}
          dataSource={items}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalMode === "create" ? "Tạo bài kiểm tra" : "Chỉnh sửa bài kiểm tra"}
        open={createModalVisible}
        onCancel={handleCloseModal}
        onOk={handleSubmitExam}
        width={900}
        okText={modalMode === "create" ? "Lưu bài kiểm tra" : "Cập nhật bài kiểm tra"}
        confirmLoading={isSubmitting}
        okButtonProps={{ disabled: isPrefilling }}
        destroyOnClose
      >
        <Spin spinning={isPrefilling}>
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              durationMinutes: 45,
              shuffleQuestions: true,
              shuffleOptions: true,
              allowBacktrack: true,
              autoSubmit: true,
              passingScore: 50,
              questions: [
                {
                  type: ExamQuestionType.SINGLE,
                  points: 1,
                  options: [
                    { text: "Đáp án A", isCorrect: true },
                    { text: "Đáp án B", isCorrect: false },
                  ],
                },
              ],
            }}
          >
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}> 
            <Input placeholder="VD: Bài kiểm tra chương 1" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Thông tin mô tả" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="courseId" label="Khoá học" rules={[{ required: true, message: "Chọn khoá học" }]}> 
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Chọn khoá học"
                  options={courses.map((course) => ({ label: course.name, value: course._id }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sessionIds"
                label="Buổi học áp dụng"
                tooltip="Chọn các buổi học trong khoá được áp dụng bài kiểm tra"
              >
                <Select
                  mode="multiple"
                  placeholder={selectedCourseId ? "Chọn buổi học" : "Chọn khoá học trước"}
                  options={courseSessions.map((session) => ({
                    label: `${session.sessionNumber ? `Buổi ${session.sessionNumber} - ` : ""}${session.title}`,
                    value: session._id,
                  }))}
                  loading={sessionsLoading}
                  disabled={!selectedCourseId}
                  optionFilterProp="label"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="durationMinutes"
                label={
                  <span>
                    Thời lượng (phút)
                    <Tooltip title="Thời gian tối đa học viên được phép làm bài (tính bằng phút)">
                      <InfoCircleOutlined style={{ marginLeft: 6, color: "var(--text-secondary)" }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true }]}
              >
                <InputNumber min={5} max={240} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="startTime" label="Thời gian mở">
                <DatePicker showTime style={{ width: "100%" }} disabledDate={(current) => current && current < dayjs().startOf("day")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="endTime" label="Thời gian đóng">
                <DatePicker showTime style={{ width: "100%" }} disabledDate={(current) => current && current < dayjs().startOf("day")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Xáo trộn câu" name="shuffleQuestions" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Xáo trộn đáp án" name="shuffleOptions" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Cho phép quay lại" name="allowBacktrack" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Tự nộp khi hết giờ" name="autoSubmit" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="passingScore"
            label={
              <span>
                Điểm đạt
                <Tooltip title="Điểm tối thiểu để học viên vượt qua bài kiểm tra (0 - 100)">
                  <InfoCircleOutlined style={{ marginLeft: 6, color: "var(--text-secondary)" }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Card size="small" style={{ marginBottom: 16 }} title="Nhập nhanh câu hỏi từ JSON">
            <Text type="secondary">
              Dán danh sách câu hỏi theo định dạng mẫu bên dưới. Có thể dùng mảng trực tiếp hoặc dạng {"{ questions: [] }"}.
            </Text>
            <div style={{ marginTop: 8 }}>
              <Text strong>Giải thích mẫu:</Text>
              <ul style={{ paddingLeft: 20, marginTop: 4, color: "var(--text-secondary)" }}>
                <li>
                  <code>type</code>: <code>SINGLE</code> (1 đáp án), <code>MULTIPLE</code> (nhiều đáp án),
                  <code>FILL_IN</code> (điền).
                </li>
                <li>
                  <code>options</code>: danh sách lựa chọn, đánh dấu <code>isCorrect: true</code> cho đáp án đúng (bỏ qua với
                  <code>FILL_IN</code>).
                </li>
                <li>
                  <code>textAnswers</code>: danh sách đáp án chấp nhận cho dạng <code>FILL_IN</code>.
                </li>
                <li>
                  <code>explanation</code>: ghi chú/giải thích cho câu hỏi (tuỳ chọn), sẽ hiển thị ở phần “Giải thích” như bên dưới.
                </li>
                <li>
                  <code>points</code>: điểm của câu; <code>tags</code>: nhãn tuỳ chọn; <code>content</code>: nội dung câu hỏi.
                </li>
              </ul>
            </div>
            <Input.TextArea
              style={{ marginTop: 8 }}
              autoSize={{ minRows: 8, maxRows: 14 }}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Dán JSON câu hỏi ở đây"
            />
            <Space style={{ marginTop: 8 }}>
              <Button onClick={() => setJsonInput(JSON_EXAMPLE)}>Khôi phục ví dụ</Button>
              <Button type="primary" icon={<ImportOutlined />} onClick={handleApplyJson} loading={isApplyingJson}>
                Áp dụng vào danh sách câu hỏi
              </Button>
            </Space>
          </Card>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field, index) => (
                  <QuestionForm key={field.key} field={field} index={index} remove={remove} form={form} />
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<FileAddOutlined />}>
                    Thêm câu hỏi
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
          </Form>
        </Spin>
      </Modal>

      <Drawer
        title="Chi tiết bài kiểm tra"
        open={detailDrawerVisible}
        onClose={() => {
          setDetailDrawerVisible(false);
          dispatch(clearSelectedExam());
        }}
        width={720}
      >
        {loading && !selectedExam ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <Spin />
          </div>
        ) : selectedExam ? (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Tiêu đề">{selectedExam.title}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">{selectedExam.description || "—"}</Descriptions.Item>
              <Descriptions.Item label="Khoá học">{selectedExam.courseId}</Descriptions.Item>
              <Descriptions.Item label="Thời lượng">{selectedExam.config.durationMinutes} phút</Descriptions.Item>
              <Descriptions.Item label="Điểm đạt">{selectedExam.config.passingScore ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={visibilityTagColor[selectedExam.visibility]}>{selectedExam.visibility}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card title={`Danh sách câu hỏi (${answeredCount})`}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {questionsForDrawer.map((question, index) => (
                  <Card key={question._id || index} size="small" type="inner" title={`Câu ${index + 1}: ${question.type}`}>
                    <Text strong>{question.content}</Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag color="blue">{question.points} điểm</Tag>
                      {question.tags?.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    {question.options && (
                      <ul style={{ marginTop: 12 }}>
                        {question.options.map((option) => (
                          <li key={option.id}>
                            <Space>
                              {question.correctAnswers?.includes(option.id) && (
                                <CheckCircleTwoTone twoToneColor="#52c41a" />
                              )}
                              <span>{option.text}</span>
                            </Space>
                          </li>
                        ))}
                      </ul>
                    )}
                    {question.textAnswers && question.textAnswers.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <Text type="secondary">Đáp án chấp nhận:</Text>
                        <Space wrap>
                          {question.textAnswers.map((ans) => (
                            <Tag key={ans}>{ans}</Tag>
                          ))}
                        </Space>
                      </div>
                    )}
                  </Card>
                ))}
              </Space>
            </Card>
          </Space>
        ) : (
          <Text type="secondary">Chọn một bài kiểm tra để xem chi tiết.</Text>
        )}
      </Drawer>
    </div>
  );
};

export default ExamManagementPage;


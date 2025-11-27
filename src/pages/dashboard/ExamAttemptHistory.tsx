import { Button, Card, Col, DatePicker, Row, Select, Space, Spin, Statistic, Table, Tag, Typography } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../components/common/Toaster";
import { ToasterType } from "../../enum/toaster";
import { courseService, type CourseListResponse } from "../../services/courseService";
import { examService } from "../../services/examService";
import type { ExamAttempt, ExamSummary } from "../../types/exam";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface CourseStudent {
  _id: string;
  fullName?: string;
  email?: string;
  avatar?: string;
}

const formatDuration = (seconds: number | null | undefined) => {
  if (seconds == null || Number.isNaN(Number(seconds))) return "—";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} phút`;
  }
  return `${minutes} phút ${remainingSeconds}s`;
};

const statusColorMap: Record<ExamAttempt["status"], string> = {
  IN_PROGRESS: "processing",
  SUBMITTED: "success",
  GRADED: "blue",
  AUTO_SUBMITTED: "warning",
};

const ExamAttemptHistory: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseListResponse["data"]>([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();

  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>();

  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>();

  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCourseLoading(true);
        const response = await courseService.getAllCourses({ limit: 200 });
        setCourses(response?.data ?? []);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải danh sách khoá học";
        showNotification(ToasterType.error, "Exam history", message);
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setExams([]);
      setSelectedExamId(undefined);
      setStudents([]);
      setSelectedStudentId(undefined);
      return;
    }

    const fetchExamsAndStudents = async () => {
      try {
        setExamLoading(true);
        const examList = await examService.getExams({ courseId: selectedCourseId });
        setExams(examList ?? []);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải danh sách bài kiểm tra";
        showNotification(ToasterType.error, "Exam history", message);
      } finally {
        setExamLoading(false);
      }

      try {
        setStudentsLoading(true);
        const response = await courseService.getCourseStudents(selectedCourseId);
        const data = Array.isArray(response?.data) ? response.data : [];
        setStudents(data);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Không thể tải danh sách học viên";
        showNotification(ToasterType.error, "Exam history", message);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchExamsAndStudents();
  }, [selectedCourseId]);

  useEffect(() => {
    setAttempts([]);
  }, [selectedExamId]);

  const fetchAttempts = useCallback(async (examId: string, options?: { studentId?: string; range?: [Dayjs | null, Dayjs | null] }) => {
    try {
      setAttemptsLoading(true);
      const params: { studentId?: string; from?: string; to?: string } = {};
      if (options?.studentId) {
        params.studentId = options.studentId;
      }
      const [from, to] = options?.range ?? [];
      if (from) {
        params.from = from.startOf("day").toISOString();
      }
      if (to) {
        params.to = to.endOf("day").toISOString();
      }
      const data = await examService.listAttempts(examId, params);
      setAttempts(data ?? []);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Không thể tải lịch sử bài làm";
      showNotification(ToasterType.error, "Exam history", message);
    } finally {
      setAttemptsLoading(false);
    }
  }, []);

  const handleSearch = async () => {
    if (!selectedExamId) {
      showNotification(ToasterType.warning, "Exam history", "Vui lòng chọn bài kiểm tra");
      return;
    }
    await fetchAttempts(selectedExamId, { studentId: selectedStudentId, range: dateRange });
  };

  const tableData = useMemo(() => {
    return (attempts ?? []).map((attempt, index) => {
      const started = attempt.startedAt ? dayjs(attempt.startedAt) : null;
      const submitted = attempt.submittedAt ? dayjs(attempt.submittedAt) : null;
      const durationSeconds = started && submitted ? submitted.diff(started, "second") : null;
      return {
        key: attempt._id,
        order: index + 1,
        studentName: attempt.student?.fullName ?? "—",
        studentEmail: attempt.student?.email ?? "—",
        startedAt: started ? started.format("DD/MM/YYYY HH:mm") : "—",
        submittedAt: submitted ? submitted.format("DD/MM/YYYY HH:mm") : "—",
        duration: formatDuration(durationSeconds ?? undefined),
        score: `${attempt.totalScore ?? 0}/${attempt.maxScore ?? 0}`,
        status: attempt.status,
        attemptId: attempt._id,
      };
    });
  }, [attempts]);

  const summaryData = useMemo(() => {
    if (!attempts || attempts.length === 0) {
      return {
        totalAttempts: 0,
        completedAttempts: 0,
        averageScore: 0,
        averagePercent: 0,
        bestScore: 0,
        worstScore: 0,
      };
    }

    const totalAttempts = attempts.length;
    const completedAttempts = attempts.filter((attempt) => attempt.status !== "IN_PROGRESS").length;
    const scoredAttempts = attempts.filter(
      (attempt) => typeof attempt.totalScore === "number" && typeof attempt.maxScore === "number",
    );

    if (scoredAttempts.length === 0) {
      return {
        totalAttempts,
        completedAttempts,
        averageScore: 0,
        averagePercent: 0,
        bestScore: 0,
        worstScore: 0,
      };
    }

    const totalScoreSum = scoredAttempts.reduce((sum, attempt) => sum + (attempt.totalScore ?? 0), 0);
    const totalMaxSum = scoredAttempts.reduce((sum, attempt) => sum + (attempt.maxScore ?? 0), 0);
    const averageScore = totalScoreSum / scoredAttempts.length;
    const averagePercent =
      totalMaxSum > 0 ? Math.round(((totalScoreSum / totalMaxSum) * 100 + Number.EPSILON) * 10) / 10 : 0;

    const bestScore = Math.max(...scoredAttempts.map((attempt) => attempt.totalScore ?? 0));
    const worstScore = Math.min(...scoredAttempts.map((attempt) => attempt.totalScore ?? 0));

    return {
      totalAttempts,
      completedAttempts,
      averageScore: Math.round((averageScore + Number.EPSILON) * 10) / 10,
      averagePercent,
      bestScore,
      worstScore,
    };
  }, [attempts]);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={3}>Lịch sử làm bài kiểm tra</Title>
          <Text type="secondary">Theo dõi toàn bộ lượt làm bài theo khoá học, học viên và thời gian.</Text>
        </Col>

        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={6}>
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Text strong>Khoá học</Text>
                    <Select
                      placeholder="Chọn khoá học"
                      loading={courseLoading}
                      allowClear
                      value={selectedCourseId}
                      onChange={(value) => setSelectedCourseId(value)}
                      options={courses.map((course) => ({
                        label: course.name,
                        value: course._id,
                      }))}
                    />
                  </Space>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Text strong>Bài kiểm tra</Text>
                    <Select
                      placeholder="Chọn bài kiểm tra"
                      loading={examLoading}
                      value={selectedExamId}
                      onChange={(value) => setSelectedExamId(value)}
                      disabled={!selectedCourseId}
                      options={exams.map((exam) => ({
                        label: exam.title,
                        value: exam._id,
                      }))}
                    />
                  </Space>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Text strong>Học viên</Text>
                    <Select
                      placeholder="Tất cả học viên"
                      loading={studentsLoading}
                      allowClear
                      value={selectedStudentId}
                      onChange={(value) => setSelectedStudentId(value)}
                      disabled={!selectedCourseId}
                      options={students.map((student) => ({
                        label: student.fullName ?? student.email ?? student._id,
                        value: student._id,
                      }))}
                    />
                  </Space>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Text strong>Khoảng thời gian</Text>
                    <RangePicker
                      style={{ width: "100%" }}
                      value={dateRange}
                      onChange={(value) => setDateRange(value ?? [null, null])}
                      disabled={!selectedExamId}
                      showTime
                      format="DD/MM/YYYY HH:mm"
                    />
                  </Space>
                </Col>
              </Row>

              <Space>
                <Button type="primary" onClick={handleSearch} disabled={!selectedExamId} loading={attemptsLoading}>
                  Xem lịch sử
                </Button>
                <Button
                  onClick={() => {
                    setSelectedStudentId(undefined);
                    setDateRange([null, null]);
                    if (selectedExamId) {
                      void fetchAttempts(selectedExamId);
                    } else {
                      setAttempts([]);
                    }
                  }}
                >
                  Xoá lọc
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Statistic title="Tổng lượt làm" value={summaryData.totalAttempts} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Statistic title="Đã nộp bài" value={summaryData.completedAttempts} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Statistic title="Điểm trung bình" value={summaryData.averageScore} precision={1} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Statistic
                  title="Điểm trung bình (%)"
                  value={summaryData.averagePercent}
                  precision={1}
                  suffix="%"
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Statistic title="Điểm cao nhất" value={summaryData.bestScore} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Statistic title="Điểm thấp nhất" value={summaryData.worstScore} />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Danh sách lượt làm bài">
            {attemptsLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                <Spin />
              </div>
            ) : (
              <Table
                pagination={{ pageSize: 10 }}
                dataSource={tableData}
                columns={[
                  { title: "#", dataIndex: "order", width: 60 },
                  { title: "Học viên", dataIndex: "studentName", width: 220 },
                  { title: "Email", dataIndex: "studentEmail", width: 220 },
                  { title: "Bắt đầu", dataIndex: "startedAt", width: 200 },
                  { title: "Nộp bài", dataIndex: "submittedAt", width: 200 },
                  { title: "Thời lượng", dataIndex: "duration", width: 140 },
                  { title: "Điểm", dataIndex: "score", width: 120 },
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    width: 160,
                    render: (status: ExamAttempt["status"]) => (
                      <Tag color={statusColorMap[status] ?? "default"}>{status}</Tag>
                    ),
                  },
                  {
                    title: "Hành động",
                    dataIndex: "attemptId",
                    render: (_: string, record: { attemptId: string }) => (
                      <Button type="link" onClick={() => navigate(`/exams/${selectedExamId}/result/${record.attemptId}`)}>
                        Xem chi tiết
                      </Button>
                    ),
                  },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExamAttemptHistory;


import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Typography,
  Dropdown,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Upload,
  Avatar,
  Popconfirm
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  UploadOutlined,
  EyeOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { sessionService, Session, CreateSessionData, UpdateSessionData } from "../../services/sessionService";
import axios from "axios";
import { RcFile } from "antd/es/upload";

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const SessionManagement: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [formValues, setFormValues] = useState<{thumbnail?: string}>({});
  const [courseFilter, setCourseFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [courses, setCourses] = useState<Array<{_id: string, title: string}>>([]);

  // Format duration to Vietnamese format
  const formatDuration = (duration: number) => {
    if (duration < 60) {
      return `${duration} phút`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
  };

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, [pagination.current, pagination.pageSize, searchTerm, courseFilter, sortBy, sortOrder]);

  // Fetch courses for filter
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getSessions({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchTerm || undefined,
        courseId: courseFilter,
        sortBy,
        sortOrder,
      });
      setSessions(response.sessions);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      message.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await sessionService.getCourses();
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const uploadThumbnail = async (file: RcFile) => {
    try {
      setUploadingThumbnail(true);
      const response = await sessionService.uploadThumbnail(file);
      form.setFieldsValue({ thumbnail: response.data.url });
      setFormValues(prev => ({ ...prev, thumbnail: response.data.url }));
      message.success('Thumbnail uploaded successfully');
      return false; // Prevent default upload
    } catch (error) {
      message.error('Failed to upload thumbnail');
      return false;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const columns = [
    {
      title: t('dashboard.sessions.title'),
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Session) => (
        <div>
          <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            ID: {record._id}
          </div>
        </div>
      ),
    },
    {
      title: t('dashboard.sessions.course'),
      dataIndex: "courseId",
      key: "courseId",
      width: 150,
      render: (courseId: string) => {
        const course = courses.find(c => c._id === courseId);
        return course ? course.title : courseId;
      },
    },
    {
      title: t('dashboard.sessions.sessionNumber'),
      dataIndex: "sessionNumber",
      key: "sessionNumber",
      width: 100,
      render: (sessionNumber: string) => (
        <Tag color="blue">{sessionNumber}</Tag>
      ),
    },
    {
      title: t('dashboard.sessions.views'),
      dataIndex: "views",
      key: "views",
      width: 80,
      render: (views: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <EyeOutlined style={{ color: "var(--text-secondary)" }} />
          {views}
        </div>
      ),
    },
    {
      title: t('dashboard.sessions.mode'),
      dataIndex: "mode",
      key: "mode",
      width: 100,
      render: (mode: string) => (
        <Tag color={mode === 'OPEN' ? 'green' : 'orange'}>{mode}</Tag>
      ),
    },
    {
      title: t('dashboard.sessions.createdAt'),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('dashboard.sessions.actions'),
      key: "actions",
      width: 120,
      render: (_: any, record: Session) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={t('dashboard.sessions.confirmDelete')}
            description={t('dashboard.sessions.confirmDeleteContent')}
            onConfirm={() => handleDelete(record._id)}
            okText={t('dashboard.sessions.delete')}
            cancelText={t('dashboard.sessions.cancel')}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingSession(null);
    form.resetFields();
    setFormValues({});
    setIsModalVisible(true);
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    form.setFieldsValue({
      title: session.title,
      sessionNumber: session.sessionNumber,
      description: session.description,
      courseId: session.courseId,
      mode: session.mode,
      videoUrl: session.videoUrl?.videoUrl,
      videoUrlMode: session.videoUrl?.mode,
      quizId: session.quizId?.quizId,
      quizIdMode: session.quizId?.mode,
      notesMd: session.notesMd?.notesMd,
      notesMdMode: session.notesMd?.mode,
    });
    setFormValues({});
    setIsModalVisible(true);
  };

  const handleView = (session: Session) => {
    // Navigate to session detail page
    console.log("View session:", session);
    message.info('View session feature coming soon');
  };

  const handleDelete = async (sessionId: string) => {
    try {
      await sessionService.deleteSession(sessionId);
      message.success(t('dashboard.sessions.deleteSuccess'));
      fetchSessions();
    } catch (error) {
      message.error('Failed to delete session');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Transform form values to match backend structure
      const cleanValues: any = {
        title: values.title,
        sessionNumber: values.sessionNumber,
        description: values.description,
        courseId: values.courseId,
        mode: values.mode,
      };

      // Handle videoUrl object
      if (values.videoUrl || values.videoUrlMode) {
        cleanValues.videoUrl = {
          videoUrl: values.videoUrl || '',
          mode: values.videoUrlMode || 'CLOSED'
        };
      }

      // Handle quizId object
      if (values.quizId || values.quizIdMode) {
        cleanValues.quizId = {
          quizId: values.quizId || '',
          mode: values.quizIdMode || 'CLOSED'
        };
      }

      // Handle notesMd object
      if (values.notesMd || values.notesMdMode) {
        cleanValues.notesMd = {
          notesMd: values.notesMd || '',
          mode: values.notesMdMode || 'CLOSED'
        };
      }

      console.log('Sending data:', cleanValues);

      if (editingSession) {
        // Update session
        const updateData: UpdateSessionData = cleanValues;
        await sessionService.updateSession(editingSession._id, updateData);
        message.success(t('dashboard.sessions.updateSuccess'));
      } else {
        // Create session
        const createData: CreateSessionData = cleanValues;
        await sessionService.createSession(createData);
        message.success(t('dashboard.sessions.createSuccess'));
      }

      setIsModalVisible(false);
      form.resetFields();
      setFormValues({});
      fetchSessions();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Operation failed');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFormValues({});
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <Title level={2} style={{ color: "var(--text-primary)", margin: 0 }}>
          {t('dashboard.sessions.title')}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          {t('dashboard.sessions.addSession')}
        </Button>
      </div>

      <Card style={{ 
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px"
      }}>
        <div style={{ marginBottom: "16px", display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Search
            placeholder={t('dashboard.sessions.searchPlaceholder')}
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => {
              if (!e.target.value) {
                setSearchTerm('');
                setPagination(prev => ({ ...prev, current: 1 }));
              }
            }}
          />
          
          <Select
            placeholder={t('dashboard.sessions.filterByCourse')}
            style={{ width: 200 }}
            allowClear
            value={courseFilter}
            onChange={(value) => {
              setCourseFilter(value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
          >
            {courses.map(course => (
              <Select.Option key={course._id} value={course._id}>
                {course.title}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder={t('dashboard.sessions.sortBy')}
            style={{ width: 150 }}
            value={sortBy}
            onChange={(value) => {
              setSortBy(value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
          >
            <Select.Option value="createdAt">{t('dashboard.sessions.sortByCreatedAt')}</Select.Option>
            <Select.Option value="updatedAt">{t('dashboard.sessions.sortByUpdatedAt')}</Select.Option>
            <Select.Option value="title">{t('dashboard.sessions.sortByTitle')}</Select.Option>
            <Select.Option value="order">{t('dashboard.sessions.sortByOrder')}</Select.Option>
          </Select>

          <Select
            placeholder={t('dashboard.sessions.sortOrder')}
            style={{ width: 150 }}
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
          >
            <Select.Option value="desc">{t('dashboard.sessions.sortDesc')}</Select.Option>
            <Select.Option value="asc">{t('dashboard.sessions.sortAsc')}</Select.Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={sessions}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('dashboard.sessions.of')} ${total} ${t('dashboard.sessions.sessions')}`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          style={{ background: "transparent" }}
        />
      </Card>

      <Modal
        title={editingSession ? t('dashboard.sessions.editSession') : t('dashboard.sessions.addSession')}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        style={{
          background: "var(--bg-primary)",
        }}
        styles={{
          body: {
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          },
          header: {
            background: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-color)",
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            mode: "OPEN"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="title"
              label={t('dashboard.sessions.title')}
              rules={[{ required: true, message: t('dashboard.sessions.titleRequired') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="sessionNumber"
              label={t('dashboard.sessions.sessionNumber')}
              rules={[{ required: true, message: t('dashboard.sessions.sessionNumberRequired') }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={t('dashboard.sessions.description')}
          >
            <TextArea rows={4} placeholder="Mô tả bài học (tùy chọn)" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="courseId"
              label={t('dashboard.sessions.course')}
              rules={[{ required: true, message: t('dashboard.sessions.courseRequired') }]}
            >
              <Select placeholder={t('dashboard.sessions.selectCourse')}>
                {courses.map(course => (
                  <Select.Option key={course._id} value={course._id}>
                    {course.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mode"
              label={t('dashboard.sessions.mode')}
            >
              <Select>
                <Select.Option value="OPEN">OPEN</Select.Option>
                <Select.Option value="CLOSED">CLOSED</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="videoUrl"
              label={t('dashboard.sessions.videoUrl')}
            >
              <Input placeholder="https://youtube.com/watch?v=..." />
            </Form.Item>

            <Form.Item
              name="videoUrlMode"
              label="Video Mode"
            >
              <Select placeholder="Chọn chế độ">
                <Select.Option value="OPEN">OPEN</Select.Option>
                <Select.Option value="CLOSED">CLOSED</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="quizId"
              label={t('dashboard.sessions.quizId')}
            >
              <Input placeholder="ID của quiz (nếu có)" />
            </Form.Item>

            <Form.Item
              name="quizIdMode"
              label="Quiz Mode"
            >
              <Select placeholder="Chọn chế độ">
                <Select.Option value="OPEN">OPEN</Select.Option>
                <Select.Option value="CLOSED">CLOSED</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="notesMd"
              label={t('dashboard.sessions.notesMd')}
            >
              <TextArea rows={6} placeholder="Nội dung markdown cho bài học (tùy chọn)" />
            </Form.Item>

            <Form.Item
              name="notesMdMode"
              label="Notes Mode"
            >
              <Select placeholder="Chọn chế độ">
                <Select.Option value="OPEN">OPEN</Select.Option>
                <Select.Option value="CLOSED">CLOSED</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SessionManagement;
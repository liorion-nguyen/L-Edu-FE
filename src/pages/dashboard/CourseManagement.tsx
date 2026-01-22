import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Typography,
  Dropdown,
  Modal,
  Form,
  Select,
  InputNumber,
  Upload,
  message,
  Tabs,
  List,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  BookOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { courseService, Course, CreateCourseData, UpdateCourseData, CourseQueryParams } from "../../services/courseService";
import { categoryService, Category } from "../../services/categoryService";
import { RcFile } from "antd/lib/upload";
import axios from "axios";

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const CourseManagement: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [formValues, setFormValues] = useState<{cover?: string, icon?: string}>({});
  const [instructors, setInstructors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [isInstructorModalVisible, setIsInstructorModalVisible] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [instructorSearchTerm, setInstructorSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Format price to VNĐ format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchInstructors();
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, searchTerm, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories({ limit: 1000 });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await courseService.getAvailableInstructors();
      setInstructors(response.data);
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await courseService.getAvailableStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchCourseStudents = async (courseId: string) => {
    try {
      const response = await courseService.getCourseStudents(courseId);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch course students:', error);
    }
    return [];
  };

  const fetchCourseInstructor = async (courseId: string) => {
    try {
      const response = await courseService.getCourseInstructor(courseId);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch course instructor:', error);
    }
    return null;
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: CourseQueryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchTerm || undefined,
        categoryId: categoryFilter || undefined,
      };

      const response = await courseService.getAllCourses(params);
      if (response.success && response.data) {
        setCourses(response.data);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination!.total,
          }));
        }
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };
  

  const columns = [
    {
      title: t('dashboard.courses.icon'),
      dataIndex: "icon",
      key: "icon",
      width: 80,
      render: (icon: string, record: Course) => (
        <Avatar 
          src={icon || "/images/landing/sections/fakeImages/courseIcon.png"} 
          icon={<BookOutlined />} 
          size="large" 
        />
      ),
    },
    {
      title: t('dashboard.courses.courseTitle'),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record: Course) => (
        <div>
          <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            ID: {record._id}
          </div>
        </div>
      ),
    },
    {
      title: t('dashboard.courses.description'),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (description: string) => (
        <div style={{ maxWidth: 200 }}>
          {description}
        </div>
      ),
    },
    {
      title: t('dashboard.courses.price'),
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span style={{ fontWeight: 500, color: "var(--accent-color)" }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: t('dashboard.courses.category'),
      dataIndex: "categoryId",
      key: "categoryId",
      width: 120,
      render: (categoryId: string, record: Course) => {
        console.log(categoryId, record, categories);
        const category = categories.find(cat => cat._id === categoryId);
        return (
          <Tag color="blue">{category?.name || record.category || 'N/A'}</Tag>
        );
      },
    },
    {
      title: t('dashboard.courses.students'),
      dataIndex: "students",
      key: "students",
      render: (students: string[], record: Course) => (
        <div>
          <span>{students.length}</span>
          {record.studentDetails && record.studentDetails.length > 0 && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {record.studentDetails.slice(0, 2).map(student => student.fullName).join(', ')}
              {record.studentDetails.length > 2 && ` +${record.studentDetails.length - 2}`}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('dashboard.courses.sessions'),
      dataIndex: "sessions",
      key: "sessions",
      render: (sessions: string[]) => sessions.length,
    },
    {
      title: t('dashboard.courses.duration'),
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} hours`,
    },
    {
      title: t('dashboard.courses.status'),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          ACTIVE: { color: "green", text: t('dashboard.courses.statusActive') },
          INACTIVE: { color: "red", text: t('dashboard.courses.statusInactive') },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('dashboard.courses.actions'),
      key: "actions",
      width: 100,
      render: (_: any, record: Course) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: t('dashboard.courses.edit'),
                icon: <EditOutlined />,
                onClick: () => handleEdit(record),
              },
              {
                key: "manageInstructor",
                label: t('dashboard.courses.manageInstructor'),
                icon: <UserOutlined />,
                onClick: () => handleManageInstructor(record),
              },
              {
                key: "manageStudents",
                label: t('dashboard.courses.manageStudents'),
                icon: <TeamOutlined />,
                onClick: () => handleManageStudents(record),
              },
              {
                key: "delete",
                label: t('dashboard.courses.delete'),
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record._id),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setFormValues({});
    setIsModalVisible(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      ...course,
      cover: course.cover,
      icon: course.icon,
      categoryId: course.categoryId || course.category, // Use categoryId if available, fallback to category
    });
    setFormValues({
      cover: course.cover,
      icon: course.icon,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (courseId: string) => {
    Modal.confirm({
      title: t('dashboard.courses.confirmDelete'),
      content: t('dashboard.courses.confirmDeleteContent'),
      okText: t('dashboard.courses.delete'),
      cancelText: t('dashboard.courses.cancel'),
      onOk: async () => {
        try {
          await courseService.deleteCourse(courseId);
          message.success(t('dashboard.courses.deleteSuccess'));
          fetchCourses();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Failed to delete course');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Ensure cover and icon are strings, not objects
      const cleanValues = {
        ...values,
        cover: typeof values.cover === 'string' && values.cover ? values.cover : formValues.cover || undefined,
        icon: typeof values.icon === 'string' && values.icon ? values.icon : formValues.icon || undefined,
      };

      // Remove empty strings to avoid validation errors
      if (cleanValues.cover === '') delete cleanValues.cover;
      if (cleanValues.icon === '') delete cleanValues.icon;

      console.log('Sending data:', cleanValues);

      if (editingCourse) {
        // Update course
        const updateData: UpdateCourseData = cleanValues;
        await courseService.updateCourse(editingCourse._id, updateData);
        message.success(t('dashboard.courses.updateSuccess'));
      } else {
        // Create course
        const createData: CreateCourseData = cleanValues;
        await courseService.createCourse(createData);
        message.success(t('dashboard.courses.createSuccess'));
      }

      setIsModalVisible(false);
      form.resetFields();
      setFormValues({});
      fetchCourses();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Operation failed');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFormValues({});
  };

  const handleManageStudents = async (course: Course) => {
    setSelectedCourse(course);
    setStudentSearchTerm(''); // Reset search term
    // Fetch current students for this course
    const currentStudents = await fetchCourseStudents(course._id);
    setSelectedCourse(prev => prev ? { ...prev, studentDetails: currentStudents } : null);
    setIsStudentModalVisible(true);
  };

  const handleManageInstructor = async (course: Course) => {
    setSelectedCourse(course);
    // Fetch current instructor for this course
    const currentInstructor = await fetchCourseInstructor(course._id);
    setSelectedCourse(prev => prev ? { ...prev, instructor: currentInstructor } : null);
    // Fetch instructors list when opening modal
    await fetchInstructors();
    setInstructorSearchTerm(''); // Reset search term
    setIsInstructorModalVisible(true);
  };

  const handleAddStudent = async (studentId: string) => {
    if (!selectedCourse) return;
    try {
      await courseService.addStudentToCourse(selectedCourse._id, studentId);
      message.success(t('dashboard.courses.studentAddedSuccess'));
      // Refresh current students list
      const currentStudents = await fetchCourseStudents(selectedCourse._id);
      setSelectedCourse(prev => prev ? { ...prev, studentDetails: currentStudents } : null);
      fetchCourses();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to add student');
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedCourse) return;
    try {
      await courseService.removeStudentFromCourse(selectedCourse._id, studentId);
      message.success(t('dashboard.courses.studentRemovedSuccess'));
      // Refresh current students list
      const currentStudents = await fetchCourseStudents(selectedCourse._id);
      setSelectedCourse(prev => prev ? { ...prev, studentDetails: currentStudents } : null);
      fetchCourses();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to remove student');
    }
  };

  const handleUpdateInstructor = async (instructorId: string) => {
    if (!selectedCourse) return;
    try {
      await courseService.updateCourseInstructor(selectedCourse._id, instructorId);
      message.success(t('dashboard.courses.instructorUpdatedSuccess') || 'Instructor updated successfully');
      // Refresh current instructor
      const currentInstructor = await fetchCourseInstructor(selectedCourse._id);
      setSelectedCourse(prev => prev ? { ...prev, instructor: currentInstructor } : null);
      fetchCourses();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update instructor');
    }
  };

  const handleRemoveInstructor = async () => {
    if (!selectedCourse) return;
    try {
      await courseService.removeCourseInstructor(selectedCourse._id);
      message.success(t('dashboard.courses.instructorRemovedSuccess') || 'Instructor removed successfully');
      // Refresh current instructor
      const currentInstructor = await fetchCourseInstructor(selectedCourse._id);
      setSelectedCourse(prev => prev ? { ...prev, instructor: currentInstructor || undefined, instructorId: undefined } : null);
      fetchCourses();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to remove instructor');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const uploadThumbnail = async (file: RcFile) => {
    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/dashboard/courses/upload/thumbnail`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success) {
        form.setFieldsValue({ cover: response.data.data.url });
        setFormValues(prev => ({ ...prev, cover: response.data.data.url }));
        message.success('Thumbnail uploaded successfully');
      }
    } catch (error) {
      message.error('Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
    return false; // Prevent default upload
  };

  const uploadIcon = async (file: RcFile) => {
    setUploadingIcon(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/dashboard/courses/upload/icon`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success) {
        form.setFieldsValue({ icon: response.data.data.url });
        setFormValues(prev => ({ ...prev, icon: response.data.data.url }));
        message.success('Icon uploaded successfully');
      }
    } catch (error) {
      message.error('Failed to upload icon');
    } finally {
      setUploadingIcon(false);
    }
    return false; // Prevent default upload
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <Title level={3} style={{ margin: 0, color: "var(--text-primary)" }}>
          {t('dashboard.courses.title')}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('dashboard.courses.addCourse')}
        </Button>
      </div>

      <Card style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px"
      }}>
        <div style={{ marginBottom: "16px", display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Search
            placeholder={t('dashboard.courses.searchPlaceholder')}
            allowClear
            style={{ width: 300, minWidth: 200 }}
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e: any) => {
              if (!e.target.value) {
                handleSearch('');
              }
            }}
          />
          <Select
            placeholder={t('dashboard.courses.filterByCategory')}
            allowClear
            style={{ width: 200, minWidth: 150 }}
            value={categoryFilter}
            onChange={handleCategoryFilter}
          >
            {categories.map(category => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={courses.map(course => ({ ...course, key: course._id }))}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}-${range[1]} ${t('dashboard.courses.of')} ${total} ${t('dashboard.courses.courses')}`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          style={{ background: "transparent" }}
        />
      </Card>

      <Modal
        title={editingCourse ? t('dashboard.courses.editCourse') : t('dashboard.courses.addCourse')}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)"
        }}
        styles={{
          header: {
            background: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-color)",
            color: "var(--text-primary)"
          },
          body: {
            background: "var(--bg-primary)",
            color: "var(--text-primary)"
          },
          footer: {
            background: "var(--bg-primary)",
            borderTop: "1px solid var(--border-color)"
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "ACTIVE" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="name"
              label={t('dashboard.courses.courseTitle')}
              rules={[{ required: true, message: t('dashboard.courses.titleRequired') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label={t('dashboard.courses.price')}
              rules={[{ required: true, message: t('dashboard.courses.priceRequired') }]}
            >
              <InputNumber 
                min={0} 
                style={{ width: "100%" }} 
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                addonAfter="VNĐ"
                placeholder={t('dashboard.courses.pricePlaceholder')}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={t('dashboard.courses.description')}
            rules={[{ required: true, message: t('dashboard.courses.descriptionRequired') }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="categoryId"
              label={t('dashboard.courses.category')}
            >
              <Select placeholder={t('dashboard.courses.selectCategory')}>
                {categories.map(category => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="duration"
              label={t('dashboard.courses.duration')}
              rules={[{ required: true, message: t('dashboard.courses.durationRequired') }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="cover"
              label={t('dashboard.courses.cover')}
              rules={[{ required: true, message: t('dashboard.courses.uploadThumbnail') }]}
            >
              <Upload
                name="thumbnail"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={uploadThumbnail}
                maxCount={1}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>
                    {uploadingThumbnail ? 'Uploading...' : t('dashboard.courses.uploadThumbnail')}
                  </div>
                </div>
              </Upload>
              {formValues.cover && (
                <div style={{ marginTop: 8 }}>
                  <img 
                    src={formValues.cover} 
                    alt="Thumbnail" 
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item
              name="icon"
              label={t('dashboard.courses.icon')}
            >
              <Upload
                name="icon"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={uploadIcon}
                maxCount={1}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>
                    {uploadingIcon ? 'Uploading...' : t('dashboard.courses.uploadIcon')}
                  </div>
                </div>
              </Upload>
              {formValues.icon && (
                <div style={{ marginTop: 8 }}>
                  <img 
                    src={formValues.icon} 
                    alt="Icon" 
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                  />
                </div>
              )}
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label={t('dashboard.courses.status')}
            rules={[{ required: true, message: t('dashboard.courses.statusRequired') }]}
          >
            <Select>
              <Select.Option value="ACTIVE">{t('dashboard.courses.statusActive')}</Select.Option>
              <Select.Option value="INACTIVE">{t('dashboard.courses.statusInactive')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Student Management Modal */}
      <Modal
        title={`${t('dashboard.courses.manageStudents')} - ${selectedCourse?.name}`}
        open={isStudentModalVisible}
        onCancel={() => {
          setIsStudentModalVisible(false);
          setStudentSearchTerm(''); // Reset search term when closing
        }}
        footer={null}
        width={800}
        style={{
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)',
        }}
        styles={{
          body: {
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-color)',
          },
        }}
      >
        <Tabs
          items={[
            {
              key: 'current',
              label: t('dashboard.courses.currentStudents'),
              children: (
                <List
                  dataSource={selectedCourse?.studentDetails || []}
                  renderItem={(student) => (
                    <List.Item
                      actions={[
                        <Popconfirm
                          title={t('dashboard.courses.confirmRemoveStudent')}
                          onConfirm={() => handleRemoveStudent(student._id)}
                          okText={t('dashboard.courses.yes')}
                          cancelText={t('dashboard.courses.no')}
                        >
                          <Button type="text" danger icon={<UserDeleteOutlined />}>
                            {t('dashboard.courses.remove')}
                          </Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={student.avatar} icon={<UserOutlined />} />}
                        title={student.fullName}
                        description={student.email}
                      />
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'add',
              label: t('dashboard.courses.addStudents'),
              children: (
                <div>
                  <Input
                    placeholder={t('dashboard.courses.searchStudents')}
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    style={{ marginBottom: 16 }}
                    prefix={<SearchOutlined />}
                  />
                  <List
                    dataSource={students.filter(student => {
                      // Filter out students already in course
                      const currentStudentIds = selectedCourse?.studentDetails?.map(s => s._id) || [];
                      const isNotInCourse = !currentStudentIds.includes(student._id);
                      // Filter by search term
                      const matchesSearch = !studentSearchTerm || 
                        student.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                        student.email.toLowerCase().includes(studentSearchTerm.toLowerCase());
                      return isNotInCourse && matchesSearch;
                    })}
                    renderItem={(student) => (
                      <List.Item
                        actions={[
                          <Button 
                            type="primary" 
                            icon={<UserAddOutlined />}
                            onClick={() => handleAddStudent(student._id)}
                          >
                            {t('dashboard.courses.add')}
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={student.avatar} icon={<UserOutlined />} />}
                          title={student.fullName}
                          description={student.email}
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: t('dashboard.courses.noStudentsFound') }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Modal>

      {/* Instructor Management Modal */}
      <Modal
        title={`${t('dashboard.courses.manageInstructor')} - ${selectedCourse?.name}`}
        open={isInstructorModalVisible}
        onCancel={() => setIsInstructorModalVisible(false)}
        footer={null}
        width={600}
        style={{
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)',
        }}
        styles={{
          body: {
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-color)',
          },
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
            {t('dashboard.courses.currentInstructor')}:
          </Typography.Text>
          {selectedCourse?.instructor ? (
            <Card 
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)',
                marginBottom: 8
              }}
            >
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <Avatar src={selectedCourse.instructor.avatar} icon={<UserOutlined />} size="large" />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 16 }}>
                      {selectedCourse.instructor.fullName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {selectedCourse.instructor.email}
                    </div>
                  </div>
                </Space>
                <Popconfirm
                  title="Xóa giảng viên?"
                  description="Bạn có chắc muốn xóa giảng viên khỏi khóa học này?"
                  onConfirm={handleRemoveInstructor}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    danger 
                    icon={<UserDeleteOutlined />}
                    type="default"
                  >
                    Xóa giảng viên
                  </Button>
                </Popconfirm>
              </Space>
            </Card>
          ) : (
            <Card style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px dashed var(--border-color)',
              textAlign: 'center',
              padding: 24
            }}>
              <Typography.Text type="secondary">
                {t('dashboard.courses.noInstructor')}
              </Typography.Text>
            </Card>
          )}
        </div>

        <div>
          <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
            {t('dashboard.courses.selectNewInstructor')}:
          </Typography.Text>
          <Input
            placeholder="Tìm kiếm giảng viên..."
            prefix={<SearchOutlined />}
            value={instructorSearchTerm}
            onChange={(e) => setInstructorSearchTerm(e.target.value)}
            style={{ marginBottom: 16 }}
            allowClear
          />
          {instructors.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: 'var(--text-secondary)'
            }}>
              <UserOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
              <div>Không có giảng viên nào</div>
            </div>
          ) : (
            <List
              style={{ marginTop: 8, maxHeight: 400, overflowY: 'auto' }}
              dataSource={instructors.filter(instructor => 
                !instructorSearchTerm || 
                instructor.fullName?.toLowerCase().includes(instructorSearchTerm.toLowerCase()) ||
                instructor.email?.toLowerCase().includes(instructorSearchTerm.toLowerCase())
              )}
              locale={{ emptyText: 'Không tìm thấy giảng viên nào' }}
              renderItem={(instructor) => (
                <List.Item
                  style={{ 
                    padding: '12px',
                    border: selectedCourse?.instructorId === instructor._id ? '2px solid #1890ff' : '1px solid var(--border-color)',
                    borderRadius: 8,
                    marginBottom: 8,
                    background: selectedCourse?.instructorId === instructor._id ? 'rgba(24, 144, 255, 0.1)' : 'var(--bg-secondary)'
                  }}
                  actions={[
                    <Button 
                      type={selectedCourse?.instructorId === instructor._id ? "default" : "primary"}
                      icon={selectedCourse?.instructorId === instructor._id ? undefined : <UserAddOutlined />}
                      onClick={() => handleUpdateInstructor(instructor._id)}
                      disabled={selectedCourse?.instructorId === instructor._id}
                    >
                      {selectedCourse?.instructorId === instructor._id 
                        ? 'Đang là giảng viên' 
                        : 'Chọn làm giảng viên'
                      }
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={instructor.avatar} icon={<UserOutlined />} size="large" />}
                    title={
                      <div>
                        <span style={{ fontWeight: 500 }}>{instructor.fullName}</span>
                        {selectedCourse?.instructorId === instructor._id && (
                          <Tag color="blue" style={{ marginLeft: 8 }}>Hiện tại</Tag>
                        )}
                      </div>
                    }
                    description={instructor.email}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CourseManagement;
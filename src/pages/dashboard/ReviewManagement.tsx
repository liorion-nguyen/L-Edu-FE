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
  Rate,
  message,
  Form,
  Select
} from "antd";
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  UserOutlined,
  BookOutlined,
  EyeOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { reviewService, Review, ReviewStats } from "../../services/reviewService";

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const ReviewManagement: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReviews();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, searchTerm, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews({
        page: pagination.current,
        limit: pagination.pageSize,
        status: statusFilter || undefined,
      });
      
      if (response.success) {
        setReviews(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewService.getReviewStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch review stats:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment,
      status: review.status,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      if (editingReview) {
        await reviewService.updateReviewStatus(editingReview._id, values.status);
        message.success(t('dashboard.reviews.updateSuccess'));
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingReview(null);
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingReview(null);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId);
      message.success(t('dashboard.reviews.deleteSuccess'));
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await reviewService.updateReviewStatus(reviewId, 'APPROVED');
      message.success(t('dashboard.reviews.approveSuccess'));
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to approve review');
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await reviewService.updateReviewStatus(reviewId, 'REJECTED');
      message.success(t('dashboard.reviews.rejectSuccess'));
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to reject review');
    }
  };

  const _mockReviewsPlaceholder = [
    {
      key: "2",
      id: "2",
      user: {
        id: "2",
        fullName: "Trần Thị B",
        avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
      },
      course: {
        id: "2",
        title: "JavaScript Fundamentals",
      },
      rating: 4,
      comment: "Khóa học tốt, nhưng có một số phần hơi khó hiểu.",
      status: "approved",
      createdAt: "2024-01-10",
    },
    {
      key: "3",
      id: "3",
      user: {
        id: "3",
        fullName: "Lê Minh C",
        avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
      },
      course: {
        id: "3",
        title: "Python Basics",
      },
      rating: 3,
      comment: "Khóa học ổn, nhưng cần cải thiện thêm về phần thực hành.",
      status: "pending",
      createdAt: "2024-01-05",
    },
  ];

  const columns = [
    {
      title: t('dashboard.reviews.user'),
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={user?.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>
              {user?.fullName || 'Anonymous'}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              ID: {user?._id}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('dashboard.reviews.course'),
      dataIndex: "course",
      key: "course",
      render: (course: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <BookOutlined style={{ color: "var(--text-secondary)" }} />
          {course?.name || 'N/A'}
        </div>
      ),
    },
    {
      title: t('dashboard.reviews.rating'),
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Rate disabled value={rating} style={{ fontSize: "16px" }} />
          <span style={{ color: "var(--text-secondary)" }}>({rating})</span>
        </div>
      ),
    },
    {
      title: t('dashboard.reviews.comment'),
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      width: 300,
    },
    {
      title: t('dashboard.reviews.status'),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          APPROVED: { color: "green", text: t('dashboard.reviews.statusApproved') },
          PENDING: { color: "orange", text: t('dashboard.reviews.statusPending') },
          REJECTED: { color: "red", text: t('dashboard.reviews.statusRejected') },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('dashboard.reviews.createdAt'),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: t('dashboard.reviews.actions'),
      key: "actions",
      width: 120,
      render: (_: any, record: Review) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "approve",
                  label: t('dashboard.reviews.approve'),
                  onClick: () => handleApprove(record._id),
                  disabled: record.status === "APPROVED",
                },
                {
                  key: "reject",
                  label: t('dashboard.reviews.reject'),
                  onClick: () => handleReject(record._id),
                  disabled: record.status === "REJECTED",
                },
                {
                  key: "edit",
                  label: t('dashboard.reviews.edit'),
                  icon: <EditOutlined />,
                  onClick: () => handleEdit(record),
                },
                {
                  key: "delete",
                  label: t('dashboard.reviews.delete'),
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
        </Space>
      ),
    },
  ];


  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <Title level={2} style={{ color: "var(--text-primary)", margin: 0 }}>
          {t('dashboard.reviews.title')}
        </Title>
      </div>

      <Card style={{ 
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px"
      }}>
        <div style={{ marginBottom: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Search
            placeholder={t('dashboard.reviews.searchPlaceholder')}
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => !e.target.value && handleSearch('')}
          />
          <Select
            placeholder={t('dashboard.reviews.status')}
            allowClear
            style={{ width: 200 }}
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <Select.Option value="PENDING">{t('dashboard.reviews.statusPending')}</Select.Option>
            <Select.Option value="APPROVED">{t('dashboard.reviews.statusApproved')}</Select.Option>
            <Select.Option value="REJECTED">{t('dashboard.reviews.statusRejected')}</Select.Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={reviews}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('dashboard.reviews.of')} ${total} ${t('dashboard.reviews.reviews')}`,
            onChange: handlePageChange,
          }}
          scroll={{ x: 1000 }}
          style={{ background: "transparent" }}
        />
      </Card>

      <Modal
        title={t('dashboard.reviews.reviewDetail')}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            {t('dashboard.reviews.cancel')}
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {t('dashboard.reviews.update')}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="user"
            label={t('dashboard.reviews.user')}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="course"
            label={t('dashboard.reviews.course')}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="rating"
            label={t('dashboard.reviews.rating')}
          >
            <Rate disabled />
          </Form.Item>

          <Form.Item
            name="comment"
            label={t('dashboard.reviews.comment')}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label={t('dashboard.reviews.status')}
          >
            <Select>
              <Select.Option value="approved">{t('dashboard.reviews.statusApproved')}</Select.Option>
              <Select.Option value="pending">{t('dashboard.reviews.statusPending')}</Select.Option>
              <Select.Option value="rejected">{t('dashboard.reviews.statusRejected')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewManagement;

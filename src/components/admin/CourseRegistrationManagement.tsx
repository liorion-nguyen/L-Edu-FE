import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  message, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Input, 
  Select,
  Descriptions,
  Avatar,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  ReloadOutlined, 
  EyeOutlined,
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import courseRegistrationService, { CourseRegistration } from '../../services/courseRegistrationService';

const { TextArea } = Input;
const { Option } = Select;

const CourseRegistrationManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<CourseRegistration | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      let data: CourseRegistration[];
      
      if (selectedStatus === 'ALL') {
        data = await courseRegistrationService.getAllRegistrations();
      } else {
        data = await courseRegistrationService.getRegistrationsByStatus(selectedStatus);
      }
      
      setRegistrations(data);
    } catch (error: any) {
      message.error('Không thể tải danh sách đăng ký: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await courseRegistrationService.getRegistrationStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  const handleViewDetails = (registration: CourseRegistration) => {
    setSelectedRegistration(registration);
    setDetailModalVisible(true);
  };

  const handleApprove = (registration: CourseRegistration) => {
    setSelectedRegistration(registration);
    setAdminNote('');
    setApprovalModalVisible(true);
  };

  const handleReject = (registration: CourseRegistration) => {
    setSelectedRegistration(registration);
    setAdminNote('');
    setApprovalModalVisible(true);
  };

  const handleApprovalSubmit = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedRegistration) return;

    try {
      await courseRegistrationService.updateRegistrationStatus(selectedRegistration._id, {
        status,
        adminNote: adminNote.trim() || undefined
      });

      message.success(`Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} đơn đăng ký thành công!`);
      setApprovalModalVisible(false);
      setAdminNote('');
      fetchRegistrations();
      fetchStats();
    } catch (error: any) {
      message.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteRegistration = async (registrationId: string) => {
    try {
      await courseRegistrationService.deleteRegistration(registrationId);
      message.success('Đã xóa đơn đăng ký thành công!');
      fetchRegistrations();
      fetchStats();
    } catch (error: any) {
      message.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'processing';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Đã từ chối';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'Người đăng ký',
      dataIndex: 'user',
      key: 'user',
      width: 200,
      render: (user: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar 
            size="small" 
            src={user?.avatar}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
              {user?.fullName || 'Unknown User'}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {user?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Khóa học',
      dataIndex: 'course',
      key: 'course',
      width: 200,
      render: (course: any) => {
        console.log('Course data in render:', course);
        // Strip HTML tags from description
        const cleanDescription = course?.description?.replace(/<[^>]*>/g, '').substring(0, 50) || '';
        
        return (
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
              {course?.title || 'Unknown Course'}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {cleanDescription}...
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Lời nhắn',
      dataIndex: 'message',
      key: 'message',
      width: 200,
      render: (message: string) => (
        <div style={{ 
          maxWidth: '180px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {message || 'Không có lời nhắn'}
        </div>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (text: any, record: CourseRegistration) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Duyệt">
                <Button
                  icon={<CheckOutlined />}
                  size="small"
                  type="primary"
                  onClick={() => handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  icon={<CloseOutlined />}
                  size="small"
                  danger
                  onClick={() => handleReject(record)}
                />
              </Tooltip>
            </>
          )}
          <Popconfirm
            title="Xóa đơn đăng ký"
            description="Bạn có chắc chắn muốn xóa đơn đăng ký này?"
            onConfirm={() => handleDeleteRegistration(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<CloseOutlined />}
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Quản lý đăng ký khóa học" style={{ marginBottom: '24px' }}>
        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Statistic
              title="Tổng số đơn"
              value={stats.total}
              prefix={<BookOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Đã duyệt"
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Đã từ chối"
              value={stats.rejected}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseOutlined />}
            />
          </Col>
        </Row>

        {/* Filters and Actions */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
            >
              <Option value="ALL">Tất cả</Option>
              <Option value="PENDING">Chờ duyệt</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="REJECTED">Đã từ chối</Option>
            </Select>
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchRegistrations}
              loading={loading}
            >
              Tải lại
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={registrations}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đơn đăng ký"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRegistration && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Người đăng ký">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar 
                  src={selectedRegistration.user?.avatar}
                  icon={<UserOutlined />}
                />
                <div>
                  <div>{selectedRegistration.user?.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {selectedRegistration.user?.email}
                  </div>
                </div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Khóa học">
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {selectedRegistration.course?.title}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {selectedRegistration.course?.description}
                </div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(selectedRegistration.status)}>
                {getStatusText(selectedRegistration.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lời nhắn">
              {selectedRegistration.message || 'Không có lời nhắn'}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú admin">
              {selectedRegistration.adminNote || 'Chưa có ghi chú'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">
              {new Date(selectedRegistration.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
            {selectedRegistration.processedAt && (
              <Descriptions.Item label="Ngày xử lý">
                {new Date(selectedRegistration.processedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        title={`${selectedRegistration?.status === 'PENDING' ? 'Duyệt' : 'Từ chối'} đơn đăng ký`}
        open={approvalModalVisible}
        onCancel={() => setApprovalModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedRegistration && (
          <div>
            <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f2f5', borderRadius: '6px' }}>
              <strong>Khóa học:</strong> {selectedRegistration.course?.title}
              <br />
              <strong>Người đăng ký:</strong> {selectedRegistration.user?.fullName}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label>Ghi chú (tùy chọn):</label>
              <TextArea
                rows={4}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Nhập ghi chú cho người dùng..."
                maxLength={500}
                showCount
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <Button 
                onClick={() => setApprovalModalVisible(false)}
                style={{ marginRight: '8px' }}
              >
                Hủy
              </Button>
              <Button 
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprovalSubmit('APPROVED')}
                style={{ marginRight: '8px', background: '#52c41a', borderColor: '#52c41a' }}
              >
                Duyệt
              </Button>
              <Button 
                danger
                icon={<CloseOutlined />}
                onClick={() => handleApprovalSubmit('REJECTED')}
              >
                Từ chối
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseRegistrationManagement;

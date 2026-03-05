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
  message
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { userService, User, CreateUserData, UpdateUserData, UserQueryParams } from "../../services/userService";

const { Title } = Typography;
const { Search } = Input;

const UserManagement: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchTerm]);

  useEffect(() => {
    if (!isModalVisible) return;
    if (editingUser) {
      const rawPhone = editingUser.phone as string | { country?: string; number?: string } | undefined;
      const phoneValue = rawPhone != null && typeof rawPhone === 'object' && 'number' in rawPhone
        ? [rawPhone.country, rawPhone.number].filter(Boolean).join(' ')
        : typeof rawPhone === 'string' ? rawPhone : undefined;
      form.setFieldsValue({
        ...editingUser,
        phone: phoneValue,
        birthday: editingUser.birthday ? new Date(editingUser.birthday).toISOString().split('T')[0] : undefined,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'ACTIVE', role: 'STUDENT' });
    }
  }, [isModalVisible, editingUser, form]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: UserQueryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchTerm || undefined,
      };
      
      const response = await userService.getAllUsers(params);
      if (response.success && response.data) {
        setUsers(response.data);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination!.total,
          }));
        }
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('dashboard.users.avatar'),
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar: string, record: User) => (
        <Avatar src={avatar || "/images/landing/sections/fakeImages/avatarStudent.png"} icon={<UserOutlined />} size="large" />
      ),
    },
    {
      title: t('dashboard.users.fullName'),
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: User) => (
        <div>
          <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            ID: {record._id}
          </div>
        </div>
      ),
    },
    {
      title: t('dashboard.users.email'),
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <MailOutlined style={{ color: "var(--text-secondary)" }} />
          {email}
        </div>
      ),
    },
    {
      title: t('dashboard.users.phone'),
      dataIndex: "phone",
      key: "phone",
      render: (phone: string | { country?: string; number?: string } | null | undefined) => {
        const display = typeof phone === 'string'
          ? phone
          : phone && typeof phone === 'object' && 'number' in phone
            ? [phone.country, phone.number].filter(Boolean).join(' ') || 'N/A'
            : 'N/A';
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <PhoneOutlined style={{ color: "var(--text-secondary)" }} />
            {display}
          </div>
        );
      },
    },
    {
      title: t('dashboard.users.status'),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          ACTIVE: { color: "green", text: t('dashboard.users.statusActive') },
          INACTIVE: { color: "red", text: t('dashboard.users.statusInactive') },
          REMOVED: { color: "gray", text: "Removed" },
          NOT_ACTIVED: { color: "orange", text: "Not Activated" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('dashboard.users.role'),
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const roleConfig = {
          ADMIN: { color: "purple", text: t('dashboard.users.roleAdmin') },
          STUDENT: { color: "blue", text: t('dashboard.users.roleStudent') },
          TEACHER: { color: "green", text: "Teacher" },
        };
        const config = roleConfig[role as keyof typeof roleConfig] || { color: "default", text: role };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('dashboard.users.lastLogin'),
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin: string) => lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never',
    },
    {
      title: t('dashboard.users.actions'),
      key: "actions",
      width: 100,
      render: (_: any, record: User) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: t('dashboard.users.edit'),
                icon: <EditOutlined />,
                onClick: () => handleEdit(record),
              },
              {
                key: "delete",
                label: t('dashboard.users.delete'),
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
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    Modal.confirm({
      title: t('dashboard.users.confirmDelete'),
      content: t('dashboard.users.confirmDeleteContent'),
      okText: t('dashboard.users.delete'),
      cancelText: t('dashboard.users.cancel'),
      onOk: async () => {
        try {
          await userService.deleteUser(userId);
          message.success(t('dashboard.users.deleteSuccess'));
          fetchUsers();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Failed to delete user');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // Update user
        const updateData: UpdateUserData = { ...values };
        await userService.updateUser(editingUser._id, updateData);
        message.success(t('dashboard.users.updateSuccess'));
      } else {
        // Create user
        const createData: CreateUserData = { ...values };
        await userService.createUser(createData);
        message.success(t('dashboard.users.createSuccess'));
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Operation failed');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
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
          {t('dashboard.users.title')}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          {t('dashboard.users.addUser')}
        </Button>
      </div>

      <Card style={{ 
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px"
      }}>
        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
          <Search
            placeholder={t('dashboard.users.searchPlaceholder')}
            allowClear
            style={{ width: 320, maxWidth: '100%' }}
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => {
              if (!e.target.value) {
                handleSearch('');
              }
            }}
          />
        </Space>

        <Table
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={users}
          loading={loading}
          size="middle"
          locale={{ emptyText: t('dashboard.users.noUsers') || 'No users' }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('dashboard.users.of')} ${total} ${t('dashboard.users.users')}`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800, y: 480 }}
          style={{ background: "transparent" }}
        />
      </Card>

      <Modal
        title={editingUser ? t('dashboard.users.editUser') : t('dashboard.users.addUser')}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose
        maskClosable={false}
        closable
        zIndex={1000}
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
          key={editingUser?._id ?? 'add'}
          initialValues={{ status: "ACTIVE", role: "STUDENT" }}
        >
          <Form.Item
            name="fullName"
            label={t('dashboard.users.fullName')}
            rules={[{ required: true, message: t('dashboard.users.fullNameRequired') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('dashboard.users.email')}
            rules={[
              { required: true, message: t('dashboard.users.emailRequired') },
              { type: "email", message: t('dashboard.users.emailInvalid') }
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="phone"
            label={t('dashboard.users.phone')}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label={t('dashboard.users.status')}
            rules={[{ required: true, message: t('dashboard.users.statusRequired') }]}
          >
            <Select placeholder={t('dashboard.users.status')} optionFilterProp="children">
              <Select.Option value="ACTIVE">{t('dashboard.users.statusActive')}</Select.Option>
              <Select.Option value="INACTIVE">{t('dashboard.users.statusInactive')}</Select.Option>
              <Select.Option value="NOT_ACTIVED">Not Activated</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label={t('dashboard.users.role')}
            rules={[{ required: true, message: t('dashboard.users.roleRequired') }]}
          >
            <Select placeholder={t('dashboard.users.role')} optionFilterProp="children">
              <Select.Option value="ADMIN">{t('dashboard.users.roleAdmin')}</Select.Option>
              <Select.Option value="STUDENT">{t('dashboard.users.roleStudent')}</Select.Option>
              <Select.Option value="TEACHER">Teacher</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="bio"
            label="Bio"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;

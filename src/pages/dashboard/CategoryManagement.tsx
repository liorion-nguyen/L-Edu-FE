import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Upload,
  Avatar,
  InputNumber,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { categoryService, Category, CreateCategoryData, UpdateCategoryData } from '../../services/categoryService';
import { RcFile } from 'antd/es/upload';
import { useTranslationWithRerender } from '../../hooks/useLanguageChange';

const { TextArea } = Input;

const CategoryManagement: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<{ icon?: string }>({});
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
      });
      setCategories(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await categoryService.getCategoryStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setFormValues({});
    setIsModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      color: category.color,
      isActive: category.isActive,
      order: category.order,
    });
    setFormValues({ icon: category.icon });
    setIsModalVisible(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await categoryService.deleteCategory(categoryId);
      message.success(t('dashboard.categories.deleteSuccess'));
      fetchCategories();
      fetchStats();
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const cleanValues: any = {
        ...values,
        icon: formValues.icon || undefined,
      };

      console.log('Sending data:', cleanValues);

      if (editingCategory) {
        const updateData: UpdateCategoryData = cleanValues;
        await categoryService.updateCategory(editingCategory._id, updateData);
        message.success(t('dashboard.categories.updateSuccess'));
      } else {
        const createData: CreateCategoryData = cleanValues;
        await categoryService.createCategory(createData);
        message.success(t('dashboard.categories.createSuccess'));
      }

      setIsModalVisible(false);
      form.resetFields();
      setFormValues({});
      fetchCategories();
      fetchStats();
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
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const uploadIcon = async (file: RcFile) => {
    try {
      setUploadingIcon(true);
      const response = await categoryService.uploadIcon(file);
      setFormValues({ icon: response.data.url });
      form.setFieldsValue({ icon: response.data.url });
      message.success('Icon uploaded successfully');
      return false; // Prevent default upload
    } catch (error) {
      message.error('Failed to upload icon');
      return false;
    } finally {
      setUploadingIcon(false);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: t('dashboard.categories.icon'),
      dataIndex: 'icon',
      key: 'icon',
      width: 60,
      render: (icon: string) => (
        <Avatar
          size={32}
          src={icon}
          style={{ backgroundColor: '#f0f0f0' }}
        >
          {!icon && 'C'}
        </Avatar>
      ),
    },
    {
      title: t('dashboard.categories.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
      width: 150,
    },
    {
      title: t('dashboard.categories.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: t('dashboard.categories.color'),
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: color || '#f0f0f0',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
          }}
        />
      ),
    },
    {
      title: t('dashboard.categories.courseCount'),
      dataIndex: 'courseCount',
      key: 'courseCount',
      width: 100,
      sorter: (a, b) => a.courseCount - b.courseCount,
      align: 'center',
    },
    {
      title: t('dashboard.categories.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('dashboard.categories.statusActive') : t('dashboard.categories.statusInactive')}
        </Tag>
      ),
    },
    {
      title: t('dashboard.categories.order'),
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order,
      align: 'center',
    },
    {
      title: t('dashboard.categories.actions'),
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            {t('dashboard.categories.edit')}
          </Button>
          <Popconfirm
            title={t('dashboard.categories.confirmDelete')}
            description={t('dashboard.categories.confirmDeleteContent')}
            onConfirm={() => handleDelete(record._id)}
            okText={t('dashboard.categories.delete')}
            cancelText={t('dashboard.categories.cancel')}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              {t('dashboard.categories.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('dashboard.categories.totalCategories')}
              value={stats.totalCategories}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('dashboard.categories.activeCategories')}
              value={stats.activeCategories}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('dashboard.categories.inactiveCategories')}
              value={stats.inactiveCategories}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('dashboard.categories.totalCourses')}
              value={stats.totalCourses}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <Input.Search
            placeholder={t('dashboard.categories.searchPlaceholder')}
            style={{ width: 300, minWidth: 200 }}
            onSearch={handleSearch}
            onChange={(e) => {
              if (e.target.value === '') {
                handleSearch('');
              }
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            {t('dashboard.categories.addCategory')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 600 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('dashboard.categories.of')} ${total} ${t('dashboard.categories.categories')}`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? t('dashboard.categories.editCategory') : t('dashboard.categories.addCategory')}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isActive: true,
            order: 0,
          }}
        >
          <Form.Item
            name="name"
            label={t('dashboard.categories.name')}
            rules={[{ required: true, message: t('dashboard.categories.nameRequired') }]}
          >
            <Input placeholder={t('dashboard.categories.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('dashboard.categories.description')}
          >
            <TextArea rows={3} placeholder={t('dashboard.categories.descriptionPlaceholder')} />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="color"
              label={t('dashboard.categories.color')}
            >
              <Input placeholder="#000000" />
            </Form.Item>

            <Form.Item
              name="order"
              label={t('dashboard.categories.order')}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="icon"
            label={t('dashboard.categories.icon')}
          >
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={uploadIcon}
              accept="image/*"
            >
              {formValues.icon ? (
                <img
                  src={formValues.icon}
                  alt="Category icon"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>{t('dashboard.categories.uploadIcon')}</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="isActive"
            label={t('dashboard.categories.status')}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;

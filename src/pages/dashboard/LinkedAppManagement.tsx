import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  message,
  Popconfirm,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Image,
  Tag,
  Collapse,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LinkOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { linkedAppService, LinkedApp, CreateLinkedAppData, UpdateLinkedAppData } from '../../services/linkedAppService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const LinkedAppManagement: React.FC = () => {
  const [apps, setApps] = useState<LinkedApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<LinkedApp | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    if (!modalVisible) return;
    if (editingApp) {
      // Convert arrays to comma-separated strings for form display
      const formValues: any = {
        name: editingApp.name,
        url: editingApp.url,
        description: editingApp.description,
        icon: editingApp.icon,
        image: editingApp.image,
        category: editingApp.category,
        isActive: editingApp.isActive,
        order: editingApp.order,
        openInNewTab: editingApp.openInNewTab,
      };
      
      if (editingApp.metadata) {
        formValues.metadata = {
          ...editingApp.metadata,
          features: editingApp.metadata.features?.join(', ') || '',
          capabilities: editingApp.metadata.capabilities?.join(', ') || '',
        };
      }
      
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        openInNewTab: true,
        order: 0,
      });
    }
  }, [modalVisible, editingApp, form]);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await linkedAppService.getLinkedAppsAdmin();
      if (response.success) {
        setApps(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch linked apps');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingApp(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      openInNewTab: true,
      order: 0,
    });
    setModalVisible(true);
  };

  const handleEdit = (app: LinkedApp) => {
    setEditingApp(app);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Process metadata - convert comma-separated strings to arrays
      const processedValues = { ...values };
      if (processedValues.metadata) {
        if (typeof processedValues.metadata.features === 'string') {
          processedValues.metadata.features = processedValues.metadata.features
            .split(',')
            .map((f: string) => f.trim())
            .filter((f: string) => f.length > 0);
        }
        if (typeof processedValues.metadata.capabilities === 'string') {
          processedValues.metadata.capabilities = processedValues.metadata.capabilities
            .split(',')
            .map((c: string) => c.trim())
            .filter((c: string) => c.length > 0);
        }
        // Remove empty metadata object
        if (Object.keys(processedValues.metadata).length === 0) {
          delete processedValues.metadata;
        }
      }

      if (editingApp) {
        const updateData: UpdateLinkedAppData = processedValues;
        await linkedAppService.updateLinkedApp(editingApp._id, updateData);
        message.success('Linked app updated successfully');
      } else {
        const createData: CreateLinkedAppData = processedValues;
        await linkedAppService.createLinkedApp(createData);
        message.success('Linked app created successfully');
      }
      setModalVisible(false);
      setEditingApp(null);
      form.resetFields();
      fetchApps();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save linked app');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingApp(null);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      await linkedAppService.deleteLinkedApp(id);
      message.success('Linked app deleted successfully');
      fetchApps();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete linked app');
    }
  };

  const handleVisit = (url: string, openInNewTab: boolean) => {
    if (openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon: string, record: LinkedApp) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon ? (
            icon.startsWith('http') ? (
              <Image src={icon} alt={record.name} width={32} height={32} style={{ objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '24px' }}>{icon}</span>
            )
          ) : (
            <AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          )}
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: LinkedApp) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          {record.category && (
            <Tag color="blue" style={{ margin: 0 }}>
              {record.category}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string, record: LinkedApp) => (
        <Button
          type="link"
          icon={<LinkOutlined />}
          onClick={() => handleVisit(url, record.openInNewTab)}
          style={{ padding: 0 }}
        >
          {url}
        </Button>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string) => description || '-',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 80,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: LinkedApp) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record)}
            title="View/Edit"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this linked app?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <AppstoreOutlined style={{ marginRight: '8px' }} />
              Linked Apps Management
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Add Linked App
            </Button>
          </Col>
        </Row>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={apps}
          loading={loading}
          size="middle"
          locale={{ emptyText: 'No linked apps' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} apps`,
          }}
          scroll={{ y: 480 }}
          expandable={{
            expandedRowRender: (record: LinkedApp) => (
              <div style={{ padding: '16px', background: '#fafafa', borderRadius: '4px' }}>
                <Row gutter={16}>
                  {record.image && (
                    <Col span={8}>
                      <Image
                        src={record.image}
                        alt={record.name}
                        style={{ width: '100%', borderRadius: '8px' }}
                      />
                    </Col>
                  )}
                  <Col span={record.image ? 16 : 24}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {record.description && (
                        <div>
                          <Text strong>Description: </Text>
                          <Text>{record.description}</Text>
                        </div>
                      )}
                      {record.metadata?.story && (
                        <div>
                          <Text strong>Story: </Text>
                          <Text>{record.metadata.story}</Text>
                        </div>
                      )}
                      {record.metadata?.features && record.metadata.features.length > 0 && (
                        <div>
                          <Text strong>Features: </Text>
                          <Space wrap>
                            {record.metadata.features.map((feature, idx) => (
                              <Tag key={idx}>{feature}</Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                      {record.metadata?.capabilities && record.metadata.capabilities.length > 0 && (
                        <div>
                          <Text strong>Capabilities: </Text>
                          <Space wrap>
                            {record.metadata.capabilities.map((cap, idx) => (
                              <Tag key={idx} color="cyan">{cap}</Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                      {record.metadata?.stats && (
                        <div>
                          <Text strong>Stats: </Text>
                          <Space>
                            {record.metadata.stats.users && (
                              <Tag color="blue">Users: {record.metadata.stats.users}</Tag>
                            )}
                            {record.metadata.stats.photos && (
                              <Tag color="green">Photos: {record.metadata.stats.photos}</Tag>
                            )}
                            {record.metadata.stats.rating && (
                              <Tag color="orange">Rating: {record.metadata.stats.rating}</Tag>
                            )}
                            {record.metadata.stats.satisfaction && (
                              <Tag color="purple">Satisfaction: {record.metadata.stats.satisfaction}</Tag>
                            )}
                          </Space>
                        </div>
                      )}
                    </Space>
                  </Col>
                </Row>
              </div>
            ),
            rowExpandable: (record: LinkedApp) => 
              !!(record.description || record.metadata?.story || record.metadata?.features?.length || 
                 record.metadata?.capabilities?.length || record.metadata?.stats || record.image),
          }}
        />

        <Modal
          title={editingApp ? 'Edit Linked App' : 'Add Linked App'}
          open={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={800}
          destroyOnClose
          maskClosable={false}
        >
          <Form
            form={form}
            layout="vertical"
            key={editingApp?._id ?? 'add'}
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter app name' }]}
                >
                  <Input placeholder="e.g., Photobooth" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                >
                  <Select placeholder="Select category">
                    <Option value="photography">Photography</Option>
                    <Option value="utility">Utility</Option>
                    <Option value="entertainment">Entertainment</Option>
                    <Option value="education">Education</Option>
                    <Option value="productivity">Productivity</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="url"
              label="URL"
              rules={[
                { required: true, message: 'Please enter URL' },
                { type: 'url', message: 'Please enter a valid URL' },
              ]}
            >
              <Input placeholder="https://example.com" prefix={<LinkOutlined />} />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea
                rows={3}
                placeholder="Brief description about the app"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="icon"
                  label="Icon (URL or Emoji)"
                >
                  <Input placeholder="https://example.com/icon.png or 📷" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="image"
                  label="Preview Image URL"
                >
                  <Input placeholder="https://example.com/preview.png" />
                </Form.Item>
              </Col>
            </Row>

            <Collapse ghost>
              <Panel header="Advanced Settings" key="advanced">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="isActive"
                      label="Active"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="openInNewTab"
                      label="Open in New Tab"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="order"
                      label="Order"
                      rules={[{ required: true, message: 'Please enter order' }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Display order"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Collapse ghost>
                  <Panel header="Metadata (Optional)" key="metadata">
                    <Form.Item
                      name={['metadata', 'story']}
                      label="Story"
                    >
                      <TextArea
                        rows={3}
                        placeholder="The story behind this app"
                      />
                    </Form.Item>

                    <Form.Item
                      name={['metadata', 'features']}
                      label="Features (comma separated)"
                    >
                      <Input placeholder="Feature 1, Feature 2, Feature 3" />
                    </Form.Item>

                    <Form.Item
                      name={['metadata', 'capabilities']}
                      label="Capabilities (comma separated)"
                    >
                      <Input placeholder="Capability 1, Capability 2" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          name={['metadata', 'stats', 'users']}
                          label="Users"
                        >
                          <Input placeholder="10K+" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={['metadata', 'stats', 'photos']}
                          label="Photos"
                        >
                          <Input placeholder="50K+" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={['metadata', 'stats', 'rating']}
                          label="Rating"
                        >
                          <Input placeholder="4.9/5" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name={['metadata', 'stats', 'satisfaction']}
                          label="Satisfaction"
                        >
                          <Input placeholder="99%" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </Panel>
            </Collapse>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '16px' }}>
              <Space>
                <Button onClick={handleModalCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingApp ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default LinkedAppManagement;

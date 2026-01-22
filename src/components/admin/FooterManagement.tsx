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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { footerService, Footer, CreateFooterData, UpdateFooterData } from '../../services/footerService';
import ImageUploader from '../common/ImageUploader';

const { Title, Text } = Typography;
const { Option } = Select;

const FooterManagement: React.FC = () => {
  const [footers, setFooters] = useState<Footer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFooter, setEditingFooter] = useState<Footer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFooters();
  }, []);

  const fetchFooters = async () => {
    try {
      setLoading(true);
      const response = await footerService.getFootersAdmin();
      if (response.success) {
        setFooters(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch footer sections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFooter(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (footer: Footer) => {
    setEditingFooter(footer);
    form.setFieldsValue({
      section: footer.section,
      title: footer.title,
      links: footer.links,
      isActive: footer.isActive,
      order: footer.order,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingFooter) {
        const updateData: UpdateFooterData = values;
        await footerService.updateFooter(editingFooter._id, updateData);
        message.success('Footer section updated successfully');
      } else {
        const createData: CreateFooterData = values;
        await footerService.createFooter(createData);
        message.success('Footer section created successfully');
      }
      setModalVisible(false);
      fetchFooters();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save footer section');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await footerService.deleteFooter(id);
      message.success('Footer section deleted successfully');
      fetchFooters();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete footer section');
    }
  };

  const columns = [
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
      render: (section: string) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: '#f0f0f0',
          fontSize: '12px',
          textTransform: 'uppercase'
        }}>
          {section}
        </span>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Links',
      dataIndex: 'links',
      key: 'links',
      render: (links: FooterLink[]) => (
        <div>
          {links.map((link, index) => (
            <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {link.icon && (
                <img 
                  src={link.icon} 
                  alt={link.label}
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
              )}
              <Text style={{ fontSize: '12px' }}>
                {link.label} {link.isExternal && '(external)'}
              </Text>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Footer) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this footer section?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
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

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>Footer Management</Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Add Footer Section
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={footers}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} sections`,
          }}
        />

        <Modal
          title={editingFooter ? 'Edit Footer Section' : 'Add Footer Section'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="section"
                  label="Section"
                  rules={[{ required: true, message: 'Please select a section' }]}
                >
                  <Select placeholder="Select footer section">
                    <Option value="company">Company</Option>
                    <Option value="support">Support</Option>
                    <Option value="legal">Legal</Option>
                    <Option value="social">Social</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please enter a title' }]}
                >
                  <Input placeholder="e.g., Company, Support, Legal" />
                </Form.Item>
              </Col>
            </Row>

            <Form.List name="links">
              {(fields, { add, remove }) => (
                <>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Links</Text>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Add Link
                    </Button>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: '8px' }}>
                      <Row gutter={8}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'label']}
                            label="Label"
                            rules={[{ required: true, message: 'Missing label' }]}
                          >
                            <Input placeholder="Link text" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'url']}
                            label="URL"
                            rules={[{ required: true, message: 'Missing URL' }]}
                          >
                            <Input placeholder="https://example.com" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'isExternal']}
                            label="External"
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'icon']}
                            label="Icon"
                          >
                            <ImageUploader 
                              placeholder="Upload logo"
                              maxSize={1}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          <Form.Item label=" ">
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="isActive"
                  label="Active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
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

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingFooter ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default FooterManagement;

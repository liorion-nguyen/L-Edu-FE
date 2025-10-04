import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { contentService, Content, CreateContentData, UpdateContentData } from '../../services/contentService';
import ImageUploader from '../common/ImageUploader';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await contentService.getContents();
      if (response.statusCode === 200) {
        setContents(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingContent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    form.setFieldsValue({
      page: content.page,
      section: content.section || 'intro', // Default to 'intro' if section is undefined
      title: content.title,
      subtitle: content.subtitle,
      descriptions: content.descriptions.join('\n'),
      sections: content.sections || [], // Ensure sections is always an array
      isActive: content.isActive,
      order: content.order || 0, // Default to 0 if order is undefined
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { descriptions, sections, ...otherValues } = values;
      const processedValues = {
        ...otherValues,
        descriptions: descriptions.split('\n').filter((d: string) => d.trim()),
        sections: sections || [], // Ensure sections is always an array, default to empty
      };

      if (editingContent) {
        await contentService.updateContent(editingContent._id, processedValues);
        message.success('Content updated successfully');
      } else {
        await contentService.createContent(processedValues);
        message.success('Content created successfully');
      }
      setModalVisible(false);
      fetchContents();
    } catch (error) {
      message.error('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteContent(id);
      message.success('Content deleted successfully');
      fetchContents();
    } catch (error) {
      message.error('Failed to delete content');
    }
  };

  const columns = [
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
      render: (page: string) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: '#e6f7ff',
          fontSize: '12px',
          textTransform: 'uppercase',
          color: '#1890ff'
        }}>
          {page}
        </span>
      ),
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
      render: (section: string) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: '#f6ffed',
          fontSize: '12px',
          color: '#52c41a'
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
      title: 'Subtitle',
      dataIndex: 'subtitle',
      key: 'subtitle',
      ellipsis: true,
    },
    {
      title: 'Sections',
      dataIndex: 'sections',
      key: 'sections',
      render: (sections: any[]) => (
        <Text style={{ fontSize: '12px' }}>
          {sections?.length || 0} sections
        </Text>
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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Content) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this content?"
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
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>Content Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Content
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={contents}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingContent ? 'Edit Content' : 'Add Content'}
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
              <Col span={8}>
                <Form.Item
                  name="page"
                  label="Page Identifier"
                  rules={[{ required: true, message: 'Please enter page identifier' }]}
                  help="e.g., about, home, contact"
                >
                  <Input 
                    placeholder="about" 
                    disabled={!!editingContent}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="section"
                  label="Section Identifier"
                  rules={[
                    { required: true, message: 'Please enter section identifier' },
                    { min: 2, message: 'Section identifier must be at least 2 characters' },
                    { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Section identifier can only contain letters, numbers, hyphens and underscores' }
                  ]}
                  help="e.g., intro, team, courses"
                >
                  <Input 
                    placeholder="intro" 
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="isActive"
                  label="Active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input placeholder="Main page title" />
            </Form.Item>

            <Form.Item
              name="subtitle"
              label="Subtitle"
              rules={[{ required: true, message: 'Please enter subtitle' }]}
            >
              <Input placeholder="Welcome message or subtitle" />
            </Form.Item>

            <Form.Item
              name="descriptions"
              label="Descriptions (one per line)"
              rules={[{ required: true, message: 'Please enter descriptions' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Enter descriptions, one per line..."
              />
            </Form.Item>

            <Form.Item
              name="order"
              label="Display Order"
              help="Lower numbers appear first (0, 1, 2, ...)"
            >
              <InputNumber 
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Divider>Content Sections (Optional)</Divider>
            <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
              Sections are optional. You can create content without sections.
            </Text>

            <Form.List name="sections">
              {(fields, { add, remove }) => (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Section
                    </Button>
                  </div>

                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: '16px' }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'title']}
                            label="Section Title"
                            rules={[{ required: true, message: 'Missing title' }]}
                          >
                            <Input placeholder="Section title" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'buttonText']}
                            label="Button Text"
                          >
                            <Input placeholder="Button text (optional)" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        label="Description"
                        rules={[{ required: true, message: 'Missing description' }]}
                      >
                        <TextArea rows={3} placeholder="Section description" />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'buttonLink']}
                            label="Button Link"
                          >
                            <Input placeholder="Button link (optional)" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'isActive']}
                            label="Active"
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
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

                      <Form.Item
                        {...restField}
                        name={[name, 'image']}
                        label="Section Image"
                      >
                        <ImageUploader 
                          placeholder="Upload section image"
                          maxSize={2}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingContent ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ContentManagement;

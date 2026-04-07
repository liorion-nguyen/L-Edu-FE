import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Contact, contactService, CreateContactData, UpdateContactData } from '../../services/contactService';
// import { ContactResponseDto } from '../../../L-Edu-BE/src/api/contact/dto/contact.dto';
import { getIconByValue } from '../../constants/icons';
import IconSelector from '../common/IconSelector';

const { Title } = Typography;
const { Option } = Select;

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!modalVisible) return;
    if (editingContact) {
      form.setFieldsValue({
        type: editingContact.type,
        label: editingContact.label,
        value: editingContact.value,
        icon: editingContact.icon,
        isActive: editingContact.isActive,
        order: editingContact.order,
      });
    } else {
      form.resetFields();
    }
  }, [modalVisible, editingContact, form]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContactsAdmin();
      if (response.success) {
        setContacts(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingContact(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingContact) {
        const updateData: UpdateContactData = values;
        await contactService.updateContact(editingContact._id, updateData);
        message.success('Contact updated successfully');
      } else {
        const createData: CreateContactData = values;
        await contactService.createContact(createData);
        message.success('Contact created successfully');
      }
      setModalVisible(false);
      setEditingContact(null);
      form.resetFields();
      fetchContacts();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save contact');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingContact(null);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      await contactService.deleteContact(id);
      message.success('Contact deleted successfully');
      fetchContacts();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete contact');
    }
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: '#f0f0f0',
          fontSize: '12px',
          textTransform: 'uppercase'
        }}>
          {type}
        </span>
      ),
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      ellipsis: true,
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => {
        const iconData = getIconByValue(icon);
        return iconData ? (
          <Space>
            <span style={{ fontSize: '16px' }}><iconData.icon /></span>
            <span>{iconData.name}</span>
          </Space>
        ) : icon || '-';
      },
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
      render: (_: any, record: Contact) => (
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
            title="Are you sure you want to delete this contact?"
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
            <Title level={2} style={{ margin: 0 }}>Contact Management</Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Add Contact
            </Button>
          </Col>
        </Row>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={contacts}
          loading={loading}
          size="middle"
          locale={{ emptyText: 'No contacts' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} contacts`,
          }}
          scroll={{ y: 480 }}
        />

        <Modal
          title={editingContact ? 'Edit Contact' : 'Add Contact'}
          open={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={600}
          destroyOnClose
          maskClosable={false}
        >
          <Form
            form={form}
            layout="vertical"
            key={editingContact?._id ?? 'add'}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select a type' }]}
            >
              <Select placeholder="Select contact type" optionFilterProp="children">
                <Option value="email">Email</Option>
                <Option value="phone">Phone</Option>
                <Option value="address">Address</Option>
                <Option value="social">Social Media</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="label"
              label="Label"
              rules={[{ required: true, message: 'Please enter a label' }]}
            >
              <Input placeholder="e.g., Email, Phone, Address" />
            </Form.Item>

            <Form.Item
              name="value"
              label="Value"
              rules={[{ required: true, message: 'Please enter a value' }]}
            >
              <Input placeholder="e.g., contact@ledu.com, +84 123 456 789" />
            </Form.Item>

            <Form.Item
              name="icon"
              label="Icon"
            >
              <IconSelector 
                type={form.getFieldValue('type') as any}
                placeholder="Select an icon"
                style={{ width: '100%' }}
              />
            </Form.Item>

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
                <Button onClick={handleModalCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingContact ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ContactManagement;

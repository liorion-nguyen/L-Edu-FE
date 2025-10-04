import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Space,
  Popconfirm,
  message,
  Typography,
  Card,
  Tag,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Divider,
} from 'antd';
import {
  MessageOutlined,
  UserOutlined,
  TeamOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Conversation {
  _id: string;
  name: string;
  type: string;
  membersId: string[];
  createdBy: string;
  createdAt: string;
}

interface Message {
  _id: string;
  message: string;
  senderId: string | { _id: string; fullName: string; avatar?: string };
  createdAt: string;
}

interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

const ConversationManagement: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithMessages | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt-access-token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/chat-room/search?limit=100&page=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Chỉ lấy conversations (type = 'CONVERSATION')
        const conversationList = data.data.filter((conv: Conversation) => conv.type === 'CONVERSATION');
        setConversations(conversationList);
      }
    } catch (error) {
      message.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationHistory = async (conversationId: string) => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('jwt-access-token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/chat-room/conversation/${conversationId}?limit=100&page=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(data.data);
        setHistoryModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to fetch conversation history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const token = localStorage.getItem('jwt-access-token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/chat-room/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('Conversation deleted successfully');
        fetchConversations();
      } else {
        throw new Error('Failed to delete conversation');
      }
    } catch (error) {
      message.error('Failed to delete conversation');
    }
  };

  const getSenderName = (senderId: string | { _id: string; fullName: string; avatar?: string }) => {
    if (typeof senderId === 'string') {
      return senderId === 'assistant' ? 'L-Edu Assistant' : 'User';
    }
    return senderId.fullName || 'Unknown User';
  };

  const getSenderAvatar = (senderId: string | { _id: string; fullName: string; avatar?: string }) => {
    if (typeof senderId === 'string') {
      return senderId === 'assistant' ? '🤖' : '👤';
    }
    return senderId.avatar || '👤';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Text strong>{name}</Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Members',
      dataIndex: 'membersId',
      key: 'membersId',
      render: (membersId: string[]) => (
        <Space>
          <UserOutlined />
          <Text>{membersId.length}</Text>
        </Space>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <Text type="secondary">
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Conversation) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => fetchConversationHistory(record._id)}
            loading={historyLoading}
          >
            View History
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this conversation?"
            onConfirm={() => handleDeleteConversation(record._id)}
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
      <Title level={2}>Conversation Management</Title>
      
      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Conversations"
              value={conversations.length}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Conversations"
              value={conversations.length}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={conversations.reduce((acc, conv) => acc + conv.membersId.length, 0)}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={conversations}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Conversation History Modal */}
      <Modal
        title={`Conversation History: ${selectedConversation?.name}`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedConversation && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Members: </Text>
              <Text>{selectedConversation.membersId.length} user(s)</Text>
            </div>
            
            <Divider />
            
            <List
              dataSource={selectedConversation.messages}
              loading={historyLoading}
              renderItem={(message: Message) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar>
                        {getSenderAvatar(message.senderId)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong>{getSenderName(message.senderId)}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {new Date(message.createdAt).toLocaleString()}
                        </Text>
                      </Space>
                    }
                    description={
                      <div style={{ 
                        backgroundColor: typeof message.senderId === 'string' && message.senderId === 'assistant' 
                          ? '#f0f0f0' 
                          : '#e6f7ff',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        marginTop: '8px'
                      }}>
                        <Text>{message.message}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConversationManagement;

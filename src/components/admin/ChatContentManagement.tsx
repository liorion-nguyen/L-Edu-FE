import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Typography,
  Modal,
  Descriptions,
  Avatar,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Divider,
  Tooltip,
  Image,
  Spin
} from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  MessageOutlined,
  UserOutlined,
  RobotOutlined,
  BarChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useTranslationWithRerender } from '../../hooks/useLanguageChange';
import { chatManagementService, ChatConversation, ChatMessage, User } from '../../services/chatManagementService';
import { createModalConfig, handleModalClose, preventModalBlocking } from '../../utils/modalUtils';
import './ChatContentManagement.css';

const { Title, Text } = Typography;
const { Search } = Input;

const ChatContentManagement: React.FC = () => {
  useTranslationWithRerender();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    averageMessagesPerConversation: 0
  });

  useEffect(() => {
    fetchConversations();
    fetchStats();

    return () => {
      setDetailModalVisible(false);
      setSelectedConversation(null);
      setConversationMessages([]);
      setLoadingMessages(false);
      preventModalBlocking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent modal blocking on component mount/unmount
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // If clicking on a button but it doesn't respond, force cleanup
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        setTimeout(() => {
          preventModalBlocking();
        }, 100);
      }
    };

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);


  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await chatManagementService.getAllConversations();
      setConversations(data);
      
      // Load user info for all conversations in parallel
      const userIds = Array.from(new Set(data.map(conv => conv.userId)));
      if (userIds.length > 0) {
        setLoadingUsers(true);
        const userPromises = userIds.map(async (userId) => {
          if (!users.has(userId)) {
            try {
              const user = await chatManagementService.getUserById(userId);
              if (user) {
                setUsers(prev => new Map(prev).set(userId, user));
              }
            } catch (error) {
              console.error(`Error loading user ${userId}:`, error);
            }
          }
        });
        
        // Wait for all user data to load
        await Promise.all(userPromises);
        setLoadingUsers(false);
      }
    } catch (error) {
      message.error('Không thể tải danh sách cuộc trò chuyện');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await chatManagementService.getChatStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCloseModal = useCallback(() => {
    handleModalClose(
      setDetailModalVisible,
      [
        () => setSelectedConversation(null),
        () => setConversationMessages([]),
        () => setLoadingMessages(false),
        () => preventModalBlocking(),
      ]
    );
  }, []);

  const handleViewConversation = useCallback(async (conversation: ChatConversation) => {
    try {
      // Set modal visible và conversation trước
      setSelectedConversation(conversation);
      setDetailModalVisible(true);
      setConversationMessages([]);
      setLoadingMessages(true);
      
      // Load user info for the conversation owner first
      if (!users.has(conversation.userId)) {
        try {
          const user = await chatManagementService.getUserById(conversation.userId);
          if (user) {
            setUsers(prev => new Map(prev).set(conversation.userId, user));
          }
        } catch (error) {
          console.error(`Error loading user ${conversation.userId}:`, error);
        }
      }
      
      const messages = await chatManagementService.getConversationWithMessages(conversation._id);
      
      if (Array.isArray(messages) && messages.length > 0) {
        // Load user info for user messages (async but don't wait)
        const userIds = Array.from(new Set(messages.filter(msg => msg.role === 'user').map(msg => msg.user?._id || conversation.userId)));
        
        // Load users in background without blocking UI
        userIds.forEach(async (userId) => {
          if (!users.has(userId)) {
            try {
              const user = await chatManagementService.getUserById(userId);
              if (user) {
                setUsers(prev => new Map(prev).set(userId, user));
              }
            } catch (error) {
              console.error(`Error loading user ${userId}:`, error);
            }
          }
        });
        
        setConversationMessages(messages);
      } else {
        setConversationMessages([]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      message.error('Không thể tải chi tiết cuộc trò chuyện');
      handleCloseModal();
    } finally {
      setLoadingMessages(false);
    }
  }, [users, handleCloseModal]);

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await chatManagementService.deleteConversation(conversationId);
      message.success('Xóa cuộc trò chuyện thành công');
      fetchConversations();
      fetchStats();
    } catch (error) {
      message.error('Không thể xóa cuộc trò chuyện');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatManagementService.deleteMessage(messageId);
      message.success('Xóa tin nhắn thành công');
      // Reload conversation messages
      if (selectedConversation) {
        const messages = await chatManagementService.getConversationWithMessages(selectedConversation._id);
        setConversationMessages(messages);
      }
    } catch (error) {
      message.error('Không thể xóa tin nhắn');
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: ChatConversation) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{text}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            ID: {record._id.substring(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      title: 'Người dùng',
      dataIndex: 'userId',
      key: 'userId',
      width: 180,
      render: (userId: string, record: ChatConversation) => {
        const user = users.get(userId);
        const displayName = user?.fullName || 'User';
        const isLoaded = !!user;
        const isLoading = loadingUsers && !isLoaded;
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              src={user?.avatar}
              style={{ 
                backgroundColor: isLoaded ? '#1890ff' : (isLoading ? '#faad14' : '#d9d9d9')
              }}
            />
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '13px',
                color: 'var(--text-primary)'
              }}>
                {displayName}
                {isLoading && <Spin size="small" style={{ marginLeft: '8px' }} />}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: 'var(--text-secondary)' 
              }}>
                {userId.substring(0, 8)}...
                {isLoaded && <Tag color="green" style={{ marginLeft: '4px', fontSize: '10px' }}>✓</Tag>}
                {isLoading && <Tag color="orange" style={{ marginLeft: '4px', fontSize: '10px' }}>⏳</Tag>}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Tin nhắn cuối',
      dataIndex: 'lastMessage',
      key: 'lastMessage',
      width: 200,
      render: (lastMessage: ChatConversation['lastMessage']) => {
        if (!lastMessage) return <Text type="secondary">Chưa có tin nhắn</Text>;
        return (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lastMessage.role === 'user' ? '👤 Người dùng' : '🤖 AI'}
            </div>
            <div style={{ 
              fontSize: '13px', 
              maxWidth: '180px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {lastMessage.content}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Số tin nhắn',
      dataIndex: 'messageCount',
      key: 'messageCount',
      width: 100,
      render: (count: number) => (
        <Tag color="blue">{count}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_: any, record: ChatConversation) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewConversation(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa cuộc trò chuyện"
            description="Bạn có chắc chắn muốn xóa cuộc trò chuyện này?"
            onConfirm={() => handleDeleteConversation(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <Title level={2} style={{ color: 'var(--text-primary)', margin: 0 }}>
          Quản lý Nội dung Chat
        </Title>
        <Button 
          icon={<ReloadOutlined />}
          onClick={() => {
            fetchConversations();
            fetchStats();
          }}
        >
          Làm mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng cuộc trò chuyện"
              value={stats.totalConversations}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cuộc trò chuyện hoạt động"
              value={stats.activeConversations}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng tin nhắn"
              value={stats.totalMessages}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="TB tin nhắn/cuộc trò chuyện"
              value={stats.averageMessagesPerConversation}
              precision={1}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ 
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <Search
            placeholder="Tìm kiếm theo tiêu đề hoặc ID người dùng..."
            allowClear
            style={{ width: 400 }}
            prefix={<SearchOutlined />}
            onSearch={setSearchTerm}
            onChange={(e) => {
              if (!e.target.value) {
                setSearchTerm('');
              }
            }}
          />
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredConversations}
          loading={loading}
          size="middle"
          locale={{ emptyText: 'Chưa có cuộc trò chuyện' }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} cuộc trò chuyện`,
            pageSize: 10,
            defaultPageSize: 10,
          }}
          scroll={{ x: 1200, y: 480 }}
          style={{ background: 'transparent' }}
          bordered={false}
        />
      </Card>

      {/* Conversation Detail Modal */}
      <Modal
        title={`Chi tiết cuộc trò chuyện: ${selectedConversation?.title}`}
        open={detailModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
        {...createModalConfig()}
      >
        {selectedConversation && (
          <div>
            <Descriptions bordered size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="ID cuộc trò chuyện" span={2}>
                <Text code>{selectedConversation._id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {(() => {
                    const user = users.get(selectedConversation.userId);
                    const isLoaded = !!user;
                    const isLoading = !isLoaded;
                    
                    return (
                      <>
                        <Avatar 
                          size="small" 
                          icon={<UserOutlined />} 
                          src={user?.avatar}
                          style={{ 
                            backgroundColor: isLoaded ? '#1890ff' : (isLoading ? '#faad14' : '#d9d9d9')
                          }}
                        />
                        <div>
                          <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '14px',
                            color: 'var(--text-primary)'
                          }}>
                            {user?.fullName || 'User'}
                            {isLoading && <Spin size="small" style={{ marginLeft: '8px' }} />}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'var(--text-secondary)' 
                          }}>
                            {selectedConversation.userId.substring(0, 8)}...
                            {isLoaded && <Tag color="green" style={{ marginLeft: '4px', fontSize: '10px' }}>✓</Tag>}
                            {isLoading && <Tag color="orange" style={{ marginLeft: '4px', fontSize: '10px' }}>⏳</Tag>}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Số tin nhắn">
                <Tag color="blue">{selectedConversation.messageCount}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedConversation.isActive ? 'green' : 'orange'}>
                  {selectedConversation.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedConversation.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">
                {new Date(selectedConversation.lastMessageAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Tin nhắn ({conversationMessages.length})</Divider>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              
              {loadingMessages ? (
                <div 
                  className="loading-state"
                  style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    borderRadius: '8px',
                    margin: '10px 0'
                  }}
                >
                  Đang tải tin nhắn...
                </div>
              ) : conversationMessages.length === 0 ? (
                <div 
                  className="empty-state"
                  style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    borderRadius: '8px',
                    margin: '10px 0'
                  }}
                >
                  Chưa có tin nhắn nào trong cuộc trò chuyện này
                </div>
              ) : (
                <div>
                  
                  {conversationMessages.map((msg, index) => {
                    const userId = msg.role === 'user' ? (selectedConversation?.userId || '') : '';
                    const user = msg.role === 'user' ? users.get(userId) : null;
                    const isUserLoaded = msg.role === 'user' ? !!user : true;
                    const displayName = msg.role === 'user' 
                      ? (user?.fullName || 'User')
                      : 'AI Assistant';
                    
                    return (
                <div
                  key={msg._id}
                  className={msg.role === 'user' ? 'message-user' : 'message-ai'}
                  style={{
                    marginBottom: '16px',
                    padding: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px' 
                  }}>
                    <Avatar 
                      size="small" 
                      icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      className={msg.role === 'user' ? 'avatar-user' : 'avatar-ai'}
                      src={user?.avatar}
                      style={{ 
                        backgroundColor: msg.role === 'user' ? (isUserLoaded ? '#1890ff' : '#faad14') : '#52c41a'
                      }}
                    />
                    <div>
                      <Text strong style={{ fontSize: '14px' }}>
                        {displayName}
                        {msg.role === 'user' && !isUserLoaded && <Spin size="small" style={{ marginLeft: '8px' }} />}
                      </Text>
                      {msg.role === 'user' && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {userId.substring(0, 8)}...
                          {isUserLoaded && <Tag color="green" style={{ marginLeft: '4px', fontSize: '10px' }}>✓</Tag>}
                          {!isUserLoaded && <Tag color="orange" style={{ marginLeft: '4px', fontSize: '10px' }}>⏳</Tag>}
                        </div>
                      )}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(msg.createdAt).toLocaleString('vi-VN')}
                    </Text>
                    <Popconfirm
                      title="Xóa tin nhắn"
                      description="Bạn có chắc chắn muốn xóa tin nhắn này?"
                      onConfirm={() => handleDeleteMessage(msg._id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{ marginLeft: 'auto' }}
                      />
                    </Popconfirm>
                  </div>
                  
                  <div style={{ 
                    marginBottom: '8px',
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom styling for markdown elements
                        p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code style={{ 
                              background: 'var(--bg-secondary, #f5f5f5)', 
                              padding: '2px 4px', 
                              borderRadius: '3px',
                              fontSize: '13px'
                            }}>{children}</code>
                          ) : (
                            <pre style={{ 
                              background: 'var(--bg-secondary, #f5f5f5)', 
                              padding: '12px', 
                              borderRadius: '6px',
                              overflow: 'auto',
                              margin: '8px 0'
                            }}>
                              <code>{children}</code>
                            </pre>
                          );
                        },
                        ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>,
                        ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ol>,
                        blockquote: ({ children }) => (
                          <blockquote style={{ 
                            borderLeft: '4px solid var(--primary-color, #1890ff)', 
                            margin: '8px 0', 
                            paddingLeft: '12px',
                            background: 'var(--bg-secondary, #fafafa)',
                            padding: '8px 12px',
                            borderRadius: '0 4px 4px 0'
                          }}>{children}</blockquote>
                        ),
                        h1: ({ children }) => <h1 style={{ fontSize: '18px', margin: '12px 0 8px 0' }}>{children}</h1>,
                        h2: ({ children }) => <h2 style={{ fontSize: '16px', margin: '10px 0 6px 0' }}>{children}</h2>,
                        h3: ({ children }) => <h3 style={{ fontSize: '15px', margin: '8px 0 4px 0' }}>{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {msg.imageUrls && msg.imageUrls.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {msg.imageUrls.map((url, imgIndex) => (
                        <Image
                          key={imgIndex}
                          width={100}
                          height={100}
                          src={url}
                          style={{ borderRadius: '4px' }}
                          placeholder={
                            <div style={{ 
                              width: 100, 
                              height: 100, 
                              background: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              Loading...
                            </div>
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChatContentManagement;

import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Modal, message, Spin, Empty, Avatar } from 'antd';
import { EyeOutlined, DeleteOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { chatHistoryService, ChatHistoryItem } from '../../services/chatHistoryService';
import { chatManagementService, User } from '../../services/chatManagementService';
import { preventModalBlocking } from '../../utils/modalUtils';

interface ChatHistoryProps {
  onViewConversation?: (conversationId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onViewConversation }) => {
  const [conversations, setConversations] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ChatHistoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState<Map<string, User>>(new Map());

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await chatHistoryService.getConversationsHistory();
      setConversations(response.data);
      
      // Fetch user info for all conversations
      const userIds = Array.from(new Set(response.data.map(conv => conv.userId)));
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
      
      await Promise.all(userPromises);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Cleanup function
    return () => {
      preventModalBlocking();
    };
  }, []);

  // Prevent modal blocking on clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        setTimeout(() => {
          preventModalBlocking();
        }, 50);
      }
    };

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  const handleViewConversation = (conversationId: string) => {
    if (onViewConversation) {
      onViewConversation(conversationId);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await chatHistoryService.deleteConversation(conversationId);
          message.success('Đã xóa cuộc trò chuyện');
          fetchConversations();
          // Ensure UI is responsive after modal closes
          setTimeout(() => preventModalBlocking(), 100);
        } catch (error: any) {
          message.error(error.message);
        }
      },
      afterClose: () => {
        // Force cleanup after modal closes
        preventModalBlocking();
      }
    });
  };

  const formatLastActivity = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return 'Vừa xong';
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      if (diffInDays < 7) return `${diffInDays} ngày trước`;
      
      return date.toLocaleDateString('vi-VN');
    } catch {
      return 'Không xác định';
    }
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
      render: (userId: string) => {
        const user = users.get(userId);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar 
              size="small" 
              icon={<UserOutlined />}
              src={user?.avatar}
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {userId.substring(0, 8)}...
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
      render: (lastMessage: ChatHistoryItem['lastMessage']) => {
        if (!lastMessage) {
          return <span style={{ color: '#999' }}>Chưa có tin nhắn</span>;
        }
        return (
          <div>
            <div style={{ 
              fontWeight: lastMessage.role === 'user' ? 'bold' : 'normal',
              color: lastMessage.role === 'user' ? '#1890ff' : '#52c41a'
            }}>
              {lastMessage.role === 'user' ? 'Bạn' : 'Chatbot'}
            </div>
            <div style={{ fontSize: '12px' }}>
              {truncateMessage(lastMessage.content)}
            </div>
            {lastMessage.imageUrls && lastMessage.imageUrls.length > 0 && (
              <Tag color="blue">
                {lastMessage.imageUrls.length} ảnh
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Số tin nhắn',
      dataIndex: 'messageCount',
      key: 'messageCount',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'green' : 'default'}>
          {count}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hoạt động cuối',
      dataIndex: 'lastMessageAt',
      key: 'lastMessageAt',
      width: 120,
      render: (dateString: string) => (
        <div style={{ fontSize: '12px' }}>
          {formatLastActivity(dateString)}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_: any, record: ChatHistoryItem) => (
        <Space size="small">
          {/* <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewConversation(record._id)}
          >
            Xem
          </Button> */}
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConversation(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải lịch sử...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty
          description="Chưa có cuộc trò chuyện nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={fetchConversations}>
            <ReloadOutlined /> Tải lại
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px' 
      }}>
        <h3>Lịch sử cuộc trò chuyện với Chatbot</h3>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchConversations}
          loading={loading}
        >
          Tải lại
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={conversations}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} cuộc trò chuyện`,
        }}
        scroll={{ x: 800 }}
        size="small"
      />
    </div>
  );
};

export default ChatHistory;

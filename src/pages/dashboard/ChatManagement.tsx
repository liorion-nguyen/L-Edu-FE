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
  message,
  Timeline
} from "antd";
import { 
  SearchOutlined, 
  DeleteOutlined,
  MoreOutlined,
  MessageOutlined,
  UserOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";

const { Title } = Typography;
const { Search } = Input;

const ChatManagement: React.FC = () => {
  const { t } = useTranslationWithRerender();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  // Mock data - sẽ được thay thế bằng API calls
  const conversations = [
    {
      key: "1",
      id: "1",
      user: {
        id: "1",
        fullName: "Nguyễn Văn A",
        avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
      },
      lastMessage: "Cảm ơn bạn đã giúp đỡ!",
      messageCount: 15,
      status: "active",
      lastActivity: "2024-01-20 14:30",
      createdAt: "2024-01-15",
    },
    {
      key: "2",
      id: "2",
      user: {
        id: "2",
        fullName: "Trần Thị B",
        avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
      },
      lastMessage: "Tôi có câu hỏi về React hooks",
      messageCount: 8,
      status: "active",
      lastActivity: "2024-01-20 12:15",
      createdAt: "2024-01-10",
    },
    {
      key: "3",
      id: "3",
      user: {
        id: "3",
        fullName: "Lê Minh C",
        avatar: "/images/landing/sections/fakeImages/avatarStudent.png",
      },
      lastMessage: "Khóa học này có khó không?",
      messageCount: 3,
      status: "inactive",
      lastActivity: "2024-01-18 16:45",
      createdAt: "2024-01-05",
    },
  ];

  // Mock chat messages
  const chatMessages = [
    {
      id: "1",
      content: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: "assistant",
      timestamp: "2024-01-20 14:25",
    },
    {
      id: "2",
      content: "Tôi muốn hỏi về cách sử dụng useState trong React",
      sender: "user",
      timestamp: "2024-01-20 14:26",
    },
    {
      id: "3",
      content: "useState là một React Hook cho phép bạn thêm state vào functional components. Đây là cách sử dụng cơ bản:\n\n```javascript\nconst [count, setCount] = useState(0);\n```",
      sender: "assistant",
      timestamp: "2024-01-20 14:27",
    },
    {
      id: "4",
      content: "Cảm ơn bạn đã giúp đỡ!",
      sender: "user",
      timestamp: "2024-01-20 14:30",
    },
  ];

  const columns = [
    {
      title: t('dashboard.chats.user'),
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={user.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{user.fullName}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              ID: {user.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('dashboard.chats.lastMessage'),
      dataIndex: "lastMessage",
      key: "lastMessage",
      ellipsis: true,
      width: 300,
    },
    {
      title: t('dashboard.chats.messageCount'),
      dataIndex: "messageCount",
      key: "messageCount",
      render: (count: number) => (
        <Tag color="blue">{count} {t('dashboard.chats.messages')}</Tag>
      ),
    },
    {
      title: t('dashboard.chats.status'),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          active: { color: "green", text: t('dashboard.chats.statusActive') },
          inactive: { color: "red", text: t('dashboard.chats.statusInactive') },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('dashboard.chats.lastActivity'),
      dataIndex: "lastActivity",
      key: "lastActivity",
      render: (time: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <ClockCircleOutlined style={{ color: "var(--text-secondary)" }} />
          {time}
        </div>
      ),
    },
    {
      title: t('dashboard.chats.actions'),
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "delete",
                  label: t('dashboard.chats.delete'),
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record.id),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleView = (conversation: any) => {
    setSelectedConversation(conversation);
    setIsModalVisible(true);
  };

  const handleDelete = (conversationId: string) => {
    Modal.confirm({
      title: t('dashboard.chats.confirmDelete'),
      content: t('dashboard.chats.confirmDeleteContent'),
      okText: t('dashboard.chats.delete'),
      cancelText: t('dashboard.chats.cancel'),
      onOk: () => {
        // API call để xóa conversation
        message.success(t('dashboard.chats.deleteSuccess'));
      },
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedConversation(null);
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
          {t('dashboard.chats.title')}
        </Title>
      </div>

      <Card style={{ 
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px"
      }}>
        <div style={{ marginBottom: "16px" }}>
          <Search
            placeholder={t('dashboard.chats.searchPlaceholder')}
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          columns={columns}
          dataSource={conversations}
          pagination={{
            total: conversations.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('dashboard.chats.of')} ${total} ${t('dashboard.chats.conversations')}`,
          }}
          scroll={{ x: 800 }}
          style={{ background: "transparent" }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageOutlined />
            {t('dashboard.chats.conversationDetail')}
            {selectedConversation && (
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                - {selectedConversation.user.fullName}
              </span>
            )}
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        width={800}
        footer={[
          <Button key="close" onClick={handleModalCancel}>
            {t('dashboard.chats.close')}
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Timeline
            items={chatMessages.map((message) => ({
              children: (
                <div style={{ 
                  background: message.sender === "user" ? "var(--bg-secondary)" : "var(--bg-primary)",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  marginBottom: "8px"
                }}>
                  <div style={{ 
                    fontWeight: 500, 
                    color: "var(--text-primary)",
                    marginBottom: "4px"
                  }}>
                    {message.sender === "user" ? selectedConversation?.user.fullName : "L-Edu Assistant"}
                  </div>
                  <div style={{ 
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap"
                  }}>
                    {message.content}
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "var(--text-secondary)",
                    marginTop: "8px"
                  }}>
                    {message.timestamp}
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChatManagement;

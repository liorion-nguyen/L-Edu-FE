import { Card, Col, Row, Statistic, Typography, Table, Tag } from "antd";
import { 
  UserOutlined, 
  BookOutlined, 
  PlayCircleOutlined, 
  StarOutlined,
  MessageOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from "@ant-design/icons";
import React from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";

const { Title } = Typography;

const DashboardHome: React.FC = () => {
  const { t } = useTranslationWithRerender();

  // Mock data - sẽ được thay thế bằng API calls
  const statistics = [
    {
      title: t('dashboard.totalUsers'),
      value: 1250,
      icon: <UserOutlined />,
      change: 12.5,
      color: "#1890ff",
    },
    {
      title: t('dashboard.totalCourses'),
      value: 45,
      icon: <BookOutlined />,
      change: 8.2,
      color: "#52c41a",
    },
    {
      title: t('dashboard.totalSessions'),
      value: 320,
      icon: <PlayCircleOutlined />,
      change: -2.1,
      color: "#faad14",
    },
    {
      title: t('dashboard.totalReviews'),
      value: 1250,
      icon: <StarOutlined />,
      change: 15.3,
      color: "#722ed1",
    },
  ];

  const recentActivities = [
    {
      key: "1",
      user: "Nguyễn Văn A",
      action: t('dashboard.actions.enrolledCourse'),
      course: "React Native từ A-Z",
      time: "2 giờ trước",
      status: "success",
    },
    {
      key: "2",
      user: "Trần Thị B",
      action: t('dashboard.actions.completedSession'),
      course: "JavaScript Fundamentals",
      time: "4 giờ trước",
      status: "success",
    },
    {
      key: "3",
      user: "Lê Minh C",
      action: t('dashboard.actions.leftReview'),
      course: "Python Basics",
      time: "6 giờ trước",
      status: "processing",
    },
    {
      key: "4",
      user: "Phạm Thị D",
      action: t('dashboard.actions.startedChat'),
      course: "Web Development",
      time: "8 giờ trước",
      status: "default",
    },
  ];

  const columns = [
    {
      title: t('dashboard.table.user'),
      dataIndex: "user",
      key: "user",
    },
    {
      title: t('dashboard.table.action'),
      dataIndex: "action",
      key: "action",
    },
    {
      title: t('dashboard.table.course'),
      dataIndex: "course",
      key: "course",
    },
    {
      title: t('dashboard.table.time'),
      dataIndex: "time",
      key: "time",
    },
    {
      title: t('dashboard.table.status'),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          success: { color: "green", text: t('dashboard.status.success') },
          processing: { color: "blue", text: t('dashboard.status.processing') },
          default: { color: "default", text: t('dashboard.status.default') },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Title level={2} style={{ color: "var(--text-primary)", marginBottom: "24px" }}>
        {t('dashboard.welcome')}
      </Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              style={{ 
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px"
              }}
            >
              <Statistic
                title={
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    color: "var(--text-secondary)"
                  }}>
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                    {stat.title}
                  </div>
                }
                value={stat.value}
                valueStyle={{ color: "var(--text-primary)" }}
                suffix={
                  <span style={{ 
                    fontSize: "12px", 
                    color: stat.change > 0 ? "#52c41a" : "#ff4d4f",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    {stat.change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(stat.change)}%
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activities */}
      <Card 
        title={
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            color: "var(--text-primary)"
          }}>
            <MessageOutlined />
            {t('dashboard.recentActivities')}
          </div>
        }
        style={{ 
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "8px"
        }}
      >
        <Table
          columns={columns}
          dataSource={recentActivities}
          pagination={{ pageSize: 5 }}
          style={{ background: "transparent" }}
        />
      </Card>
    </div>
  );
};

export default DashboardHome;

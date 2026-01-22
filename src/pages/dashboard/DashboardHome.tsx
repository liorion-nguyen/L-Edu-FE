import { Card, Col, Row, Statistic, Typography, Table, Tag, Spin, Alert } from "antd";
import { 
  UserOutlined, 
  BookOutlined, 
  PlayCircleOutlined, 
  StarOutlined,
  MessageOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CommentOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import dashboardService from "../../services/dashboardService";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import '../../styles/dashboard.css';

const { Title } = Typography;

const DashboardHome: React.FC = () => {
  const { t } = useTranslationWithRerender();
  
  // State for dashboard data
  const [stats, setStats] = useState<any>(null);
  const [userGrowthData, setUserGrowthData] = useState<{ date: string; count: number }[]>([]);
  const [courseEnrollmentData, setCourseEnrollmentData] = useState<{ course: string; enrollments: number }[]>([]);
  const [chatActivityData, setChatActivityData] = useState<{ date: string; messages: number; conversations: number }[]>([]);
  const [reviewTrendsData, setReviewTrendsData] = useState<{ date: string; reviews: number; averageRating: number }[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          statsResponse,
          userGrowthResponse,
          courseEnrollmentResponse,
          chatActivityResponse,
          reviewTrendsResponse,
          recentActivitiesResponse
        ] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getUserGrowthData(),
          dashboardService.getCourseEnrollmentData(),
          dashboardService.getChatActivityData(),
          dashboardService.getReviewTrendsData(),
          dashboardService.getRecentActivities()
        ]);


        setStats(statsResponse);
        setUserGrowthData(userGrowthResponse);
        setCourseEnrollmentData(courseEnrollmentResponse);
        setChatActivityData(chatActivityResponse);
        setReviewTrendsData(reviewTrendsResponse);
        setRecentActivities(recentActivitiesResponse);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Statistics cards data
  const statistics = stats ? [
    {
      title: t('dashboard.totalUsers'),
      value: stats.totalUsers,
      icon: <UserOutlined />,
      change: stats.userGrowthPercentage || 0,
      color: "#1890ff",
      suffix: stats.activeUsersToday ? `${stats.activeUsersToday} hoạt động hôm nay` : undefined
    },
    {
      title: t('dashboard.totalCourses'),
      value: stats.totalCourses,
      icon: <BookOutlined />,
      change: stats.courseGrowthPercentage || 0,
      color: "#52c41a",
    },
    {
      title: t('dashboard.totalSessions'),
      value: stats.totalSessions,
      icon: <PlayCircleOutlined />,
      change: stats.sessionGrowthPercentage || 0,
      color: "#faad14",
    },
    {
      title: t('dashboard.totalReviews'),
      value: stats.totalReviews,
      icon: <StarOutlined />,
      change: stats.reviewGrowthPercentage || 0,
      color: "#722ed1",
      suffix: stats.averageRating ? `Đánh giá TB: ${stats.averageRating}/5` : undefined
    },
    {
      title: "Cuộc trò chuyện",
      value: stats.totalConversations,
      icon: <CommentOutlined />,
      change: 0,
      color: "#13c2c2",
    },
    {
      title: "Tin nhắn",
      value: stats.totalMessages,
      icon: <MessageOutlined />,
      change: 0,
      color: "#eb2f96",
    },
  ] : [];

  // Fallback data for charts if no real data
  const chartUserGrowthData = userGrowthData.length > 0 ? userGrowthData : [
    { date: '01-01', count: 5 },
    { date: '01-02', count: 8 },
    { date: '01-03', count: 12 },
    { date: '01-04', count: 15 },
    { date: '01-05', count: 18 }
  ];

  const chartCourseEnrollmentData = courseEnrollmentData.length > 0 ? courseEnrollmentData : [
    { course: 'React Native', enrollments: 45 },
    { course: 'JavaScript', enrollments: 38 },
    { course: 'Python', enrollments: 32 },
    { course: 'Web Development', enrollments: 28 }
  ];

  const chartChatActivityData = chatActivityData.length > 0 ? chatActivityData : [
    { date: '01-01', messages: 12, conversations: 8 },
    { date: '01-02', messages: 18, conversations: 12 },
    { date: '01-03', messages: 25, conversations: 15 },
    { date: '01-04', messages: 22, conversations: 14 },
    { date: '01-05', messages: 30, conversations: 18 }
  ];

  const chartReviewTrendsData = reviewTrendsData.length > 0 ? reviewTrendsData : [
    { date: '01-01', reviews: 8, averageRating: 4.2 },
    { date: '01-02', reviews: 12, averageRating: 4.5 },
    { date: '01-03', reviews: 15, averageRating: 4.3 },
    { date: '01-04', reviews: 10, averageRating: 4.6 },
    { date: '01-05', reviews: 18, averageRating: 4.4 }
  ];


  // Map action types to translated labels
  const getActionLabel = (action: string): string => {
    const actionMap: Record<string, string> = {
      'enrolled_course': 'Đăng ký khóa học',
      'completed_session': 'Hoàn thành bài học',
      'left_review': 'Để lại đánh giá',
      'started_chat': 'Bắt đầu chat'
    };
    return actionMap[action] || action;
  };

  const columns = [
    {
      title: t('dashboard.table.user') || 'Người dùng',
      dataIndex: "user",
      key: "user",
    },
    {
      title: t('dashboard.table.action') || 'Hoạt động',
      dataIndex: "action",
      key: "action",
      render: (action: string) => getActionLabel(action),
    },
    {
      title: t('dashboard.table.course') || 'Khóa học',
      dataIndex: "course",
      key: "course",
    },
    {
      title: t('dashboard.table.time') || 'Thời gian',
      dataIndex: "time",
      key: "time",
    },
    {
      title: t('dashboard.table.status') || 'Trạng thái',
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          success: { color: "green", text: t('dashboard.status.success') || 'Thành công' },
          processing: { color: "blue", text: t('dashboard.status.processing') || 'Đang xử lý' },
          default: { color: "default", text: t('dashboard.status.default') || 'Mới' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        className="dashboard-error"
      />
    );
  }

  return (
    <div className="dashboard-container">
      <Title level={2} className="dashboard-title">
        {t('dashboard.welcome')}
      </Title>
      
      <div>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          {statistics.map((stat, index) => (
            <Col xs={24} sm={12} lg={8} xl={4} key={index}>
              <Card className="statistics-card">
                <Statistic
                  title={
                    <div className="statistics-icon">
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                      {stat.title}
                    </div>
                  }
                  value={stat.value}
                  valueStyle={{ color: "var(--text-primary)" }}
                  suffix={
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      {stat.change !== 0 && (
                        <span className={`statistics-change ${stat.change > 0 ? 'positive' : 'negative'}`}>
                          {stat.change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                          {Math.abs(stat.change)}%
                        </span>
                      )}
                      {stat.suffix && (
                        <span className="statistics-suffix">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts Section */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          {/* User Growth Chart */}
          <Col xs={24} lg={12}>
            <Card 
              title="Tăng trưởng người dùng (30 ngày qua)"
              className="chart-card"
            >
              <div className="chart-container">
                {chartUserGrowthData && chartUserGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartUserGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#1890ff" 
                        strokeWidth={2}
                        name="Người dùng mới"
                        dot={{ fill: '#1890ff', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Course Enrollment Chart */}
          <Col xs={24} lg={12}>
            <Card 
              title="Top khóa học theo lượt đăng ký"
              className="chart-card"
            >
              <div className="chart-container">
                {chartCourseEnrollmentData && chartCourseEnrollmentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartCourseEnrollmentData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="course" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="enrollments" fill="#52c41a" name="Lượt đăng ký" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          {/* Chat Activity Chart */}
          <Col xs={24} lg={12}>
            <Card 
              title="Hoạt động chat (7 ngày qua)"
              className="chart-card"
            >
              <div className="chart-container">
                {chartChatActivityData && chartChatActivityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartChatActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#13c2c2" 
                        strokeWidth={2}
                        name="Tin nhắn"
                        dot={{ fill: '#13c2c2', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="conversations" 
                        stroke="#eb2f96" 
                        strokeWidth={2}
                        name="Cuộc trò chuyện"
                        dot={{ fill: '#eb2f96', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Review Trends Chart */}
          <Col xs={24} lg={12}>
            <Card 
              title="Xu hướng đánh giá (30 ngày qua)"
              className="chart-card"
            >
              <div className="chart-container">
                {chartReviewTrendsData && chartReviewTrendsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartReviewTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        yAxisId="left" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="reviews" fill="#722ed1" name="Số đánh giá" radius={[8, 8, 0, 0]} />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="averageRating" 
                        stroke="#faad14" 
                        strokeWidth={2}
                        name="Điểm TB"
                        dot={{ fill: '#faad14', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </Card>
          </Col>
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
          className="chart-card"
        >
          <Table
            columns={columns}
            dataSource={recentActivities}
            pagination={{ pageSize: 5 }}
            className="activity-table"
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;

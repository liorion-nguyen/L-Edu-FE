import { Layout, Menu, Typography, Avatar, Dropdown, Button } from "antd";
import { 
  HomeOutlined,
  UserOutlined, 
  BookOutlined, 
  PlayCircleOutlined, 
  StarOutlined, 
  SettingOutlined, 
  MessageOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ContactsOutlined,
  FileTextOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslationWithRerender } from "../hooks/useLanguageChange";
import { useTheme } from "../contexts/ThemeContext";
import { useSelector } from "../redux/store";
import { RootState } from "../redux/store";
import { Role } from "../enum/user.enum";
import i18n from "../i18n";
import "../styles/layout.css";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslationWithRerender();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);


  const menuItems = useMemo(() => [
    {
      key: "/dashboard",
      icon: <HomeOutlined />,
      label: t('dashboard.overview'),
    },
    {
      key: "/dashboard/users",
      icon: <UserOutlined />,
      label: t('dashboard.userManagement'),
    },
    {
      key: "/dashboard/courses",
      icon: <BookOutlined />,
      label: t('dashboard.courseManagement'),
    },
    {
      key: "/dashboard/course-registrations",
      icon: <UserAddOutlined />,
      label: t('dashboard.courseRegistrationManagement'),
      roles: [Role.ADMIN, Role.TEACHER],
    },
    {
      key: "/dashboard/categories",
      icon: <AppstoreOutlined />,
      label: t('dashboard.categoryManagement'),
    },
    {
      key: "/dashboard/sessions",
      icon: <PlayCircleOutlined />,
      label: t('dashboard.sessionManagement'),
    },
    {
      key: "/dashboard/reviews",
      icon: <StarOutlined />,
      label: t('dashboard.reviewManagement'),
    },
    {
      key: "/dashboard/contact",
      icon: <ContactsOutlined />,
      label: t('dashboard.contactManagement'),
    },
    {
      key: "/dashboard/content",
      icon: <FileTextOutlined />,
      label: t('dashboard.contentManagement'),
    },
    {
      key: "/dashboard/footer",
      icon: <SettingOutlined />,
      label: t('dashboard.footerManagement'),
    },
    {
      key: "/dashboard/chat",
      icon: <MessageOutlined />,
      label: t('dashboard.chatManagement'),
    },
  ], [t]);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const userMenuItems = useMemo(() => [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t('dashboard.profile'),
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t('dashboard.logout'),
      onClick: handleLogout,
    },
  ], [t]);

  return (
    <Layout className="dashboard-layout" style={{ height: "100vh", background: "var(--bg-primary)" }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-color)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{ 
          padding: "16px", 
          textAlign: "center",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-primary)"
        }}>
          <Text strong style={{ color: "var(--text-primary)", fontSize: collapsed ? "16px" : "18px" }}>
            {collapsed ? "L-E" : "L-Edu Dashboard"}
          </Text>
        </div>
        
        <Menu
          theme={isDark ? "dark" : "light"}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: "transparent",
            border: "none",
            marginTop: "16px",
            height: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        <Header style={{ 
          padding: "0 24px", 
          background: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          right: 0,
          left: collapsed ? 80 : 200,
          zIndex: 99,
          height: 64,
          transition: "left 0.2s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                color: "var(--text-primary)",
              }}
            />
            
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              size="middle"
              style={{
                background: "var(--primary-color, #1890ff)",
                borderColor: "var(--primary-color, #1890ff)",
              }}
            >
              {!collapsed && "Quay lại Home"}
            </Button>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              type="text"
              onClick={toggleTheme}
              style={{
                color: isDark ? "#ffd700" : "#1890ff",
                fontSize: "18px",
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </Button>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)"
              }}>
                <Avatar 
                  src={user?.avatar || "/images/landing/sections/fakeImages/avatarStudent.png"} 
                  size="small"
                />
                <Text style={{ color: "var(--text-primary)" }}>
                  {user?.fullName || "Admin"}
                </Text>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content 
          className="dashboard-content"
          style={{ 
            margin: "24px 16px", 
            marginTop: 88, // Space for fixed header
            height: "calc(100vh - 112px)", // Full height minus header and margins
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

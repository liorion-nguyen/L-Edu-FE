import SectionLayout from "../../../layouts/SectionLayout";
import { Button, Col, Layout, Menu, Row, Drawer, Grid, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CSSProperties, useEffect, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import UserMenu from "../UserMenu";
import { dispatch, RootState, useSelector } from "../../../redux/store";
import { getUser } from "../../../redux/slices/auth";
import { localStorageConfig } from "../../../config";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Header = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([
    { key: "/", label: "Home" },
    { key: "/aboutus", label: "About" },
    { key: "/course", label: "Course" },
  ]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [user]);

  const getSizeScreen = () => {
    return screens.md || screens.lg || screens.xl || screens.xxl;
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem(localStorageConfig.accessToken);
    localStorage.removeItem(localStorageConfig.refreshToken);
    navigate("/login");
  };

  useEffect(() => {
    if (open) {
      if (user) {
        setMenuItems((prev: any) => [
          ...prev,
          { key: "logout", label: <Text style={styles.menuItem} onClick={handleLogout}>Logout</Text> },
        ]);
      } else {
        setMenuItems((prev: any) => [
          ...prev,
          { key: "/login", label: <Text style={styles.menuItem}>Login</Text> },
        ]);
      }
    } else {
      setMenuItems((prev) => prev.filter((item) => item.key !== "logout" && item.key !== "/login"));
    }
  }, [open]);

  return (
    <Layout.Header style={styles.header}>
      <SectionLayout>
        <Row justify="space-between" align="middle" style={{ width: "100%" }}>
          {/* Logo and Slogan */}
          <Col lg={4} md={6} sm={18} xs={18}>
            <div style={styles.logoContainer} onClick={handleHome}>
              <img src="/logo_name.png" alt="logo" style={styles.logo} />
            </div>
          </Col>

          {/* Menu for larger screens */}
          <Col lg={16} md={12} sm={0} xs={0}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems.map((item) => ({
                ...item,
                label: <Text style={styles.menuItem}>{item.label}</Text>,
              }))}
              onClick={({ key }) => navigate(key)}
              style={styles.menu}
            />
          </Col>

          {/* Enroll Button + Menu Icon for mobile */}
          <Col lg={4} md={6} sm={6} xs={6} style={{ textAlign: "right" }}>
            {user ? (
              getSizeScreen() && <UserMenu user={user} />
            ) : (
              <Button
                style={{
                  ...styles.button,
                  display: getSizeScreen() ? "inline-flex" : "none",
                }}
                onClick={handleLogin}
              >
                Enroll Now
              </Button>
            )}
            <MenuOutlined
              style={{
                ...styles.menuIcon,
                display: getSizeScreen() ? "none" : "inline-flex",
              }}
              onClick={() => setOpen(true)}
            />
          </Col>
        </Row>
      </SectionLayout>

      {/* Drawer for mobile */}
      <Drawer
        title={
          <Text style={styles.drawerTitle}>{user ? user.fullName : "Guest Account"}</Text>
        }
        placement="right"
        closable
        onClose={() => setOpen(false)}
        open={open}
        bodyStyle={styles.drawerBody}
        headerStyle={styles.drawerHeader}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            ...item,
            label: <Text style={styles.menuItem}>{item.label}</Text>,
          }))}
          onClick={({ key }) => {
            navigate(key);
            setOpen(false);
          }}
          style={styles.drawerMenu}
        />
      </Drawer>
    </Layout.Header>
  );
};

export default Header;

const styles: {
  header: CSSProperties;
  logoContainer: CSSProperties;
  logo: CSSProperties;
  slogan: CSSProperties;
  menu: CSSProperties;
  menuItem: CSSProperties;
  button: CSSProperties;
  menuIcon: CSSProperties;
  drawerTitle: CSSProperties;
  drawerHeader: CSSProperties;
  drawerBody: CSSProperties;
  drawerMenu: CSSProperties;
} = {
  header: {
    background: "rgba(10, 46, 46, 0.8)", // Dark teal with transparency for glassmorphism
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(161, 161, 161, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    position: "fixed",
    zIndex: 1000,
    top: 0,
    left: 0,
    width: "100%",
    padding: 0,
    transition: "box-shadow 0.3s",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    cursor: "pointer",
  },
  logo: {
    maxHeight: "40px",
    // filter: "drop-shadow(0 0 5px rgba(78, 205, 196, 0.3))", // Teal glow
  },
  slogan: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "12px",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  menu: {
    flex: 1,
    justifyContent: "center",
    background: "transparent",
    borderBottom: "none",
  },
  menuItem: {
    color: "#B0E0E6", // Pale teal for text
    fontSize: "16px",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    transition: "color 0.3s",
  },
  button: {
    background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
    border: "none",
    color: "#B0E0E6", // Pale teal for text
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
    transition: "box-shadow 0.3s",
  },
  menuIcon: {
    fontSize: "24px",
    color: "#B0E0E6", // Pale teal for icon
    cursor: "pointer",
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  drawerTitle: {
    color: "#B0E0E6", // Pale teal for text
    textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
  },
  drawerHeader: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    borderBottom: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
  },
  drawerBody: {
    background: "linear-gradient(135deg, #0A2E2E 0%, #1A4A4A 100%)", // Dark teal gradient
    // Subtle circuit pattern in lighter teal
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%234ECDC4' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  drawerMenu: {
    background: "transparent",
    border: "none",
  },
};

// Add hover effects and animations using CSS
const styleSheetHeader = document.createElement("style");
styleSheetHeader.innerText = `
  .ant-layout-header:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .ant-menu-item:hover .ant-typography {
    color: #4ECDC4 !important; /* Brighter teal on hover */
  }
  .ant-menu-item-selected .ant-typography {
    color: #4ECDC4 !important; /* Brighter teal for selected item */
    text-shadow: 0 0 10px rgba(78, 205, 196, 0.5) !important; /* Enhanced glow */
  }
  .enroll-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
`;
document.head.appendChild(styleSheetHeader);
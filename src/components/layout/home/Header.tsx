import { MenuOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Grid, Layout, Menu, Row, Typography } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { localStorageConfig } from "../../../config";
import { COLORS } from "../../../constants/colors";
import SectionLayout from "../../../layouts/SectionLayout";
import { getUser } from "../../../redux/slices/auth";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import UserMenu from "../UserMenu";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Header = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
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
  }, [user, dispatch]);

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
  }, [open, user, handleLogout]);

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
    background: COLORS.background.primary,
    border: `1px solid ${COLORS.border.light}`,
    position: "fixed",
    zIndex: 1000,
    top: 0,
    left: 0,
    width: "100%",
    padding: 0,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    cursor: "pointer",
  },
  logo: {
    maxHeight: "40px",
  },
  slogan: {
    color: COLORS.text.secondary,
    fontSize: "12px",
  },
  menu: {
    flex: 1,
    justifyContent: "center",
    background: "transparent",
    borderBottom: "none",
  },
  menuItem: {
    color: COLORS.text.primary,
    fontSize: "16px",
    fontWeight: 500,
  },
  button: {
    background: COLORS.primary[500],
    color: COLORS.background.primary,
    border: "none",
    fontWeight: 500,
    borderRadius: "8px",
  },
  menuIcon: {
    color: COLORS.text.primary,
    fontSize: "18px",
  },
  drawerTitle: {
    color: COLORS.text.heading,
    fontSize: "16px",
    fontWeight: 600,
  },
  drawerHeader: {
    background: COLORS.background.primary,
    borderBottom: `1px solid ${COLORS.border.light}`,
  },
  drawerBody: {
    background: COLORS.background.primary,
    padding: "20px",
  },
  drawerMenu: {
    background: "transparent",
    borderRight: "none",
  },
};
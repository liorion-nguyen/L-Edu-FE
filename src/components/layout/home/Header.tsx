import { MenuOutlined, CodeOutlined, LockOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Grid, Layout, Menu, Row, Typography } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import { localStorageConfig } from "../../../config";
import { COLORS } from "../../../constants/colors";
import SectionLayout from "../../../layouts/SectionLayout";
import { getUser } from "../../../redux/slices/auth";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import UserMenu from "../UserMenu";
import { useTheme } from "../../../contexts/ThemeContext";
import LanguageSwitcher from "../../common/LanguageSwitcher";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Header = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, toggleTheme, isDark } = useTheme();
  const { t, language } = useTranslationWithRerender();
  const [menuItems, setMenuItems] = useState([
    { key: "/", label: t('navigation.home') },
    { key: "/aboutus", label: t('navigation.about') },
    { key: "/course", label: t('navigation.course') },
    // { 
    //   key: "/code-editor", 
    //   label: t('navigation.codeEditor'),
    //   icon: <CodeOutlined />
    // },
  ]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [user, dispatch]);

  // Update menu items when language changes
  useEffect(() => {
    const baseMenuItems = [
      { key: "/", label: t('navigation.home') },
      { key: "/aboutus", label: t('navigation.about') },
      { key: "/course", label: t('navigation.course') },
      { key: "/exams", label: t('navigation.exams') },
      // { 
      //   key: "/code-editor", 
      //   label: t('navigation.codeEditor'),
      //   icon: <CodeOutlined />
      // },
    ];

    // Add Dashboard link for admin users
    if (user?.role === 'ADMIN') {
      baseMenuItems.push({ key: "/dashboard", label: t('navigation.dashboard') });
    }

    setMenuItems(baseMenuItems);
  }, [language, t, user]);

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
        setMenuItems((prev: any) => {
          const filteredItems = prev.filter((item: any) => 
            item.key !== "logout" && 
            item.key !== "/login" && 
            item.key !== "/change-password"
          );
          return [
            ...filteredItems, 
            { 
              key: "/change-password", 
              label: t('auth.changePassword.title'),
              icon: <LockOutlined />
            },
            { key: "logout", label: t('navigation.logout') }
          ];
        });
      } else {
        setMenuItems((prev: any) => {
          const hasLogin = prev.find((item: any) => item.key === "/login");
          if (!hasLogin) {
            return [...prev, { key: "/login", label: t('navigation.login') }];
          }
          return prev;
        });
      }
    } else {
      setMenuItems((prev) => prev.filter((item) => 
        item.key !== "logout" && 
        item.key !== "/login" && 
        item.key !== "/change-password"
      ));
    }
  }, [open, user]);

  const handleMenuClick = ({ key }: { key: string }) => {
    console.log('Menu clicked:', key);
    if (key === "logout") {
      handleLogout();
    } else {
      console.log('Navigating to:', key);
      navigate(key);
    }
  };

  const handleDrawerMenuClick = ({ key }: { key: string }) => {
    console.log('Drawer menu clicked:', key);
    if (key === "logout") {
      handleLogout();
    } else {
      console.log('Navigating to:', key);
      navigate(key);
    }
    setOpen(false);
  };

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
              onClick={handleMenuClick}
              style={styles.menu}
            />
          </Col>

          {/* Enroll Button + Menu Icon for mobile */}
          <Col lg={4} md={6} sm={6} xs={6} style={{ textAlign: "right" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              {/* Language Switcher - chỉ hiển thị trên desktop */}
              {getSizeScreen() && <LanguageSwitcher />}
              
              {/* Theme Toggle Button - chỉ hiển thị trên desktop */}
              {getSizeScreen() && (
                <Button
                  type="text"
                  icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                  style={{
                    color: isDark ? '#ffd700' : '#1890ff',
                    fontSize: '18px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
                />
              )}
              
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
                  {t('course.enrollNow')}
                </Button>
              )}
              
              <MenuOutlined
                style={{
                  ...styles.menuIcon,
                  display: getSizeScreen() ? "none" : "inline-flex",
                }}
                onClick={() => setOpen(true)}
              />
            </div>
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
          items={[
            // Language switcher item
            {
              key: 'language-switcher',
              label: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{t('language.switchLanguage')}</span>
                  <LanguageSwitcher showIcon={false} />
                </div>
              ),
            },
            // Theme toggle item
            {
              key: 'theme-toggle',
              label: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{isDark ? t('theme.light') : t('theme.dark')}</span>
                  <Button
                    type="text"
                    icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggleTheme}
                    style={{
                      color: isDark ? '#ffd700' : '#1890ff',
                      fontSize: '16px',
                    }}
                  />
                </div>
              ),
            },
            // Divider
            { type: 'divider' },
            // Other menu items
            ...menuItems.map((item) => ({
              ...item,
              label: <Text style={styles.menuItem}>{item.label}</Text>,
            }))
          ]}
          onClick={handleDrawerMenuClick}
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
    color: "var(--text-primary)",
    fontSize: "16px",
    fontWeight: 600,
  },
  drawerHeader: {
    background: "var(--bg-primary)",
    borderBottom: "1px solid var(--border-color)",
  },
  drawerBody: {
    background: "var(--bg-primary)",
    padding: "20px",
  },
  drawerMenu: {
    background: "transparent",
    borderRight: "none",
  },
};
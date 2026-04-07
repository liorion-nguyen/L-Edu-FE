import { LockOutlined, MenuOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Drawer, Grid, Layout, Menu, Typography } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { localStorageConfig } from "../../../config";
import { COLORS } from "../../../constants/colors";
import { CODELAB_BRAND_NAME } from "../../../constants/codelabSite";
import { useTheme } from "../../../contexts/ThemeContext";
import { Role } from "../../../enum/user.enum";
import { useTranslationWithRerender } from "../../../hooks/useLanguageChange";
import { getUser } from "../../../redux/slices/auth";
import { RootState, useDispatch, useSelector } from "../../../redux/store";
import LanguageSwitcher from "../../common/LanguageSwitcher";
import UserMenu from "../UserMenu";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Header = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toggleTheme, isDark } = useTheme();
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
      // { 
      //   key: "/code-editor", 
      //   label: t('navigation.codeEditor'),
      //   icon: <CodeOutlined />
      // },
    ];

    // Show student dashboard shortcut when logged in
    if (user) {
      baseMenuItems.push({ key: "/dashboard-program", label: "Dashboard" });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const handleDrawerMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      handleLogout();
    } else {
      navigate(key);
    }
    setOpen(false);
  };

  const isDesktop = getSizeScreen();

  return (
    <Layout.Header
      style={{
        ...styles.header,
        background: "transparent",
        borderBottom: "none",
      }}
    >
      {/* Stitch-like navigation */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
          isDark ? "bg-background-dark/80 border-slate-800" : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button type="button" className="flex items-center gap-3 text-left" onClick={handleHome}>
            <img
              src="/codelab/logo/logo_row.png"
              alt={CODELAB_BRAND_NAME}
              className="h-10 w-auto max-w-[200px] object-contain object-left md:h-12 md:max-w-none"
            />
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {menuItems
              .filter((i: any) => i.key !== "logout" && i.key !== "/login" && i.key !== "/change-password")
              .map((item: any) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.key)}
                  className={`transition-colors hover:text-primary ${
                    location.pathname === item.key ? "text-primary" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>

          <div className="flex items-center gap-4">
            {isDesktop && (
              <>
                <button
                  className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors"
                  type="button"
                  aria-label="Tìm kiếm"
                  onClick={() => navigate("/course")}
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                    search
                  </span>
                </button>
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
              </>
            )}

            {isDesktop && <LanguageSwitcher variant="iconButton" />}

            {user?.role === Role.ADMIN && isDesktop && (
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
                className="h-10 w-10 rounded-xl flex items-center justify-center border transition-colors"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--hover-bg)",
                  color: isDark ? "#fbbf24" : "var(--primary-color)",
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 0, display: "inline-flex" }}>
                  {isDark ? <SunOutlined /> : <MoonOutlined />}
                </span>
              </button>
            )}

            {user ? (
              isDesktop ? (
                <UserMenu user={user} />
              ) : (
                <MenuOutlined style={{ ...styles.menuIcon }} onClick={() => setOpen(true)} />
              )
            ) : (
              <>
                {isDesktop ? (
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-primary/25"
                    onClick={handleLogin}
                  >
                    {t("navigation.login")}
                  </button>
                ) : (
                  <MenuOutlined style={{ ...styles.menuIcon }} onClick={() => setOpen(true)} />
                )}
              </>
            )}
          </div>
        </div>
      </nav>

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
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {t('language.switchLanguage')}
                  </span>
                  <div className="shrink-0">
                    <LanguageSwitcher showIcon={false} />
                  </div>
                </div>
              ),
            },
            // Theme toggle item
            {
              key: 'theme-toggle',
              label: (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {isDark ? t('theme.light') : t('theme.dark')}
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    title={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border transition-colors"
                    style={{
                      borderColor: "var(--border-color)",
                      background: "var(--hover-bg)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center rounded-full"
                      style={{
                        width: 28,
                        height: 28,
                        background: isDark ? "rgba(251, 191, 36, 0.18)" : "rgba(35, 131, 226, 0.12)",
                        color: isDark ? "#fbbf24" : "var(--primary-color)",
                      }}
                    >
                      {isDark ? <SunOutlined /> : <MoonOutlined />}
                    </span>
                    <span className="leading-none">
                      {isDark ? t("theme.light") : t("theme.dark")}
                    </span>
                  </button>
                </div>
              ),
            },
            // Divider
            { type: 'divider' },
            // Other menu items
            ...menuItems.map((item) => ({
              ...item,
              label: (
                <Text style={{ ...styles.menuItem, color: "var(--text-primary)" }}>
                  {item.label}
                </Text>
              ),
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
  actions: CSSProperties;
  actionDivider: CSSProperties;
  button: CSSProperties;
  menuIcon: CSSProperties;
  drawerTitle: CSSProperties;
  drawerHeader: CSSProperties;
  drawerBody: CSSProperties;
  drawerMenu: CSSProperties;
} = {
  header: {
    position: "fixed",
    zIndex: 1000,
    top: 0,
    left: 0,
    width: "100%",
    padding: 0,
    height: 80,
    lineHeight: "80px",
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
    fontSize: "16px",
    fontWeight: 500,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "flex-end",
  },
  actionDivider: {
    height: 24,
    marginInline: 4,
    borderColor: "rgba(148, 163, 184, 0.5)",
  },
  button: {
    background: COLORS.primary[500],
    color: "#fff",
    border: "none",
    fontWeight: 700,
    borderRadius: 12,
    height: 40,
    paddingInline: 18,
    boxShadow: "0 10px 24px rgba(24, 144, 255, 0.25)",
  },
  menuIcon: {
    color: "var(--text-primary)",
    fontSize: "18px",
    cursor: "pointer",
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
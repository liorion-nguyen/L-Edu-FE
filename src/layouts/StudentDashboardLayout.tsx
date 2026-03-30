import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher, { DASHBOARD_HEADER_ICON_BUTTON_CLASS } from "../components/common/LanguageSwitcher";
import { useTheme } from "../contexts/ThemeContext";
import { localStorageConfig } from "../config";
import { RootState, useSelector } from "../redux/store";
import { useDispatch } from "../redux/store";
import { getUser } from "../redux/slices/auth";
import DashboardLoginModal from "../components/auth/DashboardLoginModal";

type NavItem = { key: string; label: string; icon: string };

const StudentDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const [loginOpen, setLoginOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(() => {
    try {
      return localStorage.getItem("student-dashboard-nav-collapsed") === "1";
    } catch {
      return false;
    }
  });

  const navItems = useMemo<NavItem[]>(
    () => [
      { key: "/dashboard-program", label: "Bảng điều khiển", icon: "dashboard" },
      { key: "/dashboard-program/classes", label: "Lớp học", icon: "class" },
      { key: "/dashboard-program/courses", label: "Khoá học", icon: "menu_book" },
      { key: "/dashboard-program/schedule", label: "Lịch học", icon: "calendar_today" },
      { key: "/dashboard-program/certificates", label: "Chứng chỉ", icon: "workspace_premium" },
      { key: "/dashboard-program/settings", label: "Cài đặt", icon: "settings" },
    ],
    [],
  );

  const studentIdSuffix = user?._id ? String(user._id).slice(-6) : "202401";

  const handleLogout = () => {
    localStorage.removeItem(localStorageConfig.accessToken);
    localStorage.removeItem(localStorageConfig.refreshToken);
    // Stay on the current dashboard route; auth gate will show login modal.
    setLoginOpen(true);
  };

  // When visiting /dashboard-program/*:
  // - If token exists but user isn't hydrated: fetch user.
  // - If no token and no user: show inline login modal (do not redirect).
  useEffect(() => {
    if (!location.pathname.startsWith("/dashboard-program")) return;
    const token = typeof window !== "undefined" ? localStorage.getItem(localStorageConfig.accessToken) : null;
    if (!user?._id && token) {
      void dispatch(getUser());
      setLoginOpen(false);
      return;
    }
    if (!user?._id && !token) {
      setLoginOpen(true);
      return;
    }
    setLoginOpen(false);
  }, [dispatch, location.pathname, user?._id]);

  useEffect(() => {
    try {
      localStorage.setItem("student-dashboard-nav-collapsed", navCollapsed ? "1" : "0");
    } catch {
      // ignore storage issues
    }
  }, [navCollapsed]);

  return (
    <div className="font-display antialiased h-dvh max-h-dvh flex overflow-hidden bg-slate-50 dark:bg-[#0b1219] text-slate-900 dark:text-slate-100">
      {/* Sidebar — giống stitch; cuộn riêng nếu menu dài, không kéo giãn layout */}
      <aside
        className={[
          "hidden md:flex shrink-0 flex-col min-h-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1923] transition-[width] duration-200",
          navCollapsed ? "w-20" : "w-64",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className={[
            "shrink-0 text-left hover:opacity-90 transition-opacity",
            navCollapsed ? "p-4 flex items-center justify-center" : "p-6 flex items-center gap-3",
          ].join(" ")}
          aria-label="Về trang chủ"
          title="Về trang chủ"
        >
          <img
            src="/logo_name.png"
            alt="logo"
            className={[
              "rounded-[10px] object-contain",
              navCollapsed ? "h-10 w-10" : "h-12",
            ].join(" ")}
          />
        </button>

        <nav
          className={[
            "flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 mt-2 pb-2",
            navCollapsed ? "px-2" : "px-4",
          ].join(" ")}
        >
          {navItems.map((it) => {
            const active =
              it.key === "/dashboard-program/courses"
                ? location.pathname === it.key ||
                  location.pathname.startsWith("/dashboard-program/courses/") ||
                  location.pathname.startsWith("/dashboard-program/learn/")
                : it.key === "/dashboard-program/classes"
                  ? location.pathname === it.key || location.pathname.startsWith("/dashboard-program/classes/")
                : location.pathname === it.key;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => navigate(it.key)}
                title={navCollapsed ? it.label : undefined}
                className={`w-full flex items-center rounded-xl text-left transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                } ${navCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"}`}
              >
                <span className="material-symbols-outlined text-[22px]">{it.icon}</span>
                {!navCollapsed && <span className="truncate">{it.label}</span>}
              </button>
            );
          })}
        </nav>

        <div
          className={[
            "border-t border-slate-200 dark:border-slate-800 shrink-0",
            navCollapsed ? "p-2" : "p-4",
          ].join(" ")}
        >
          <div className={["flex items-center p-2", navCollapsed ? "flex-col gap-2" : "gap-3"].join(" ")}>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 overflow-hidden shrink-0">
              {user?.avatar ? (
                <img alt="" src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-lg">person</span>
              )}
            </div>
            {!navCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{user?.fullName || "Học viên"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Student ID: #{studentIdSuffix}</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/30 text-slate-500 dark:text-slate-300 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-colors shrink-0"
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden bg-slate-50 dark:bg-[#0b1219]">
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f1923]/50 backdrop-blur-md flex items-center justify-between px-6 md:px-8 z-10">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setNavCollapsed((v) => !v)}
              className={DASHBOARD_HEADER_ICON_BUTTON_CLASS}
              aria-label={navCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
              title={navCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              <span className="material-symbols-outlined text-[22px] leading-none">
                {navCollapsed ? "left_panel_open" : "left_panel_close"}
              </span>
            </button>
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="search"
                placeholder="Tìm kiếm tài liệu, khóa học..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-3">
            <button
              type="button"
              aria-label="Thông báo"
              className={`${DASHBOARD_HEADER_ICON_BUTTON_CLASS} relative`}
            >
              <span className="material-symbols-outlined text-[22px] leading-none">notifications</span>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-100 dark:ring-slate-800" />
            </button>
            <LanguageSwitcher variant="iconButton" iconButtonUniform />
            <button
              type="button"
              aria-label="Đổi theme"
              onClick={toggleTheme}
              className={DASHBOARD_HEADER_ICON_BUTTON_CLASS}
            >
              {isDark ? <SunOutlined className="text-lg leading-none" /> : <MoonOutlined className="text-lg leading-none" />}
            </button>
          </div>
        </header>

        <div
          className={[
            "flex-1 min-h-0 overflow-y-auto overscroll-contain p-8 max-w-7xl mx-auto w-full transition",
            loginOpen ? "pointer-events-none select-none blur-[1.5px] opacity-70" : "",
          ].join(" ")}
        >
          {children}
        </div>
      </main>

      <DashboardLoginModal open={loginOpen} onSuccess={() => setLoginOpen(false)} />
    </div>
  );
};

export default StudentDashboardLayout;

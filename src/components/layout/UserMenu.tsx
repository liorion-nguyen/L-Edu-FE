import { LinkOutlined, LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { envConfig, localStorageConfig } from "../../config";
import { Role } from "../../enum/user.enum";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { logout } from "../../redux/slices/auth";
import { useDispatch } from "../../redux/store";

const UserMenu = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslationWithRerender();

  const getAdminLink = () => {
    const adminBase = envConfig.adminURL?.replace(/\/$/, "") || "";
    const accessToken = typeof window !== "undefined" ? localStorage.getItem(localStorageConfig.accessToken) : null;
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem(localStorageConfig.refreshToken) : null;
    if (accessToken) {
      let url = `${adminBase}/auth/callback?token=${encodeURIComponent(accessToken)}`;
      if (refreshToken) url += `&refresh_token=${encodeURIComponent(refreshToken)}`;
      return url;
    }
    return `${adminBase}/Login`;
  };

  const handleLogout = async () => {
    const response = await dispatch(logout());
    if (response.payload) {
      navigate("/login");
    }
  };

  const menu = (
    <Menu
      selectable={false}
      className="min-w-[220px] p-2 rounded-2xl border shadow-xl"
      style={{
        background: "var(--bg-primary)",
        borderColor: "var(--border-color)",
        boxShadow: "0 20px 50px rgba(2, 6, 23, 0.25)",
      }}
    >
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate(`/profile/${user?._id}`)}
        className="!my-0 !rounded-xl !px-3 !py-2 hover:!text-primary"
        style={{ color: "var(--text-primary)" }}
      >
        {user?.fullName}
      </Menu.Item>
      <Menu.Divider className="!my-2" style={{ background: "var(--border-color)" }} />
      <Menu.Item
        key="change-password"
        icon={<LockOutlined />}
        onClick={() => navigate("/change-password")}
        className="!my-0 !rounded-xl !px-3 !py-2 hover:!text-primary"
        style={{ color: "var(--text-secondary)" }}
      >
        {t('auth.changePassword.title')}
      </Menu.Item>
      {user?.role === Role.ADMIN && (
        <Menu.Item
          key="go-admin"
          icon={<LinkOutlined />}
          onClick={() => window.open(getAdminLink(), "_blank", "noopener,noreferrer")}
          className="!my-0 !rounded-xl !px-3 !py-2 hover:!text-primary"
          style={{ color: "var(--text-secondary)" }}
        >
          Vào Admin
        </Menu.Item>
      )}
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className="!my-0 !rounded-xl !px-3 !py-2"
        style={{ color: "#ef4444" }}
      >
        {t('navigation.logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight" overlayClassName="ledu-user-menu">
      <button
        type="button"
        aria-label={t("navigation.userMenu") ?? "User menu"}
        className="inline-flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
      >
        <img
          src={user?.avatar || "./images/landing/sections/fakeImages/avatarStudent.png"}
          alt="avatar"
          className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm transition-all hover:ring-primary/50"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </button>
    </Dropdown>
  );
};

export default UserMenu;

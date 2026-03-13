import { Typography } from "antd";
import React from "react";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import "../../styles/dashboard.css";

const { Title, Paragraph } = Typography;

/**
 * Trang Dashboard: Điều hướng sang Admin.
 * Tài khoản Admin: mở menu tài khoản (góc phải trên) → chọn "Vào Admin" để mở trang quản trị trong tab mới (dùng luôn phiên đăng nhập).
 */
const DashboardHome: React.FC = () => {
  const { t } = useTranslationWithRerender();

  return (
    <div className="dashboard-container">
      <Title level={2} className="dashboard-title" style={{ marginBottom: 24 }}>
        {t("dashboard.welcome")}
      </Title>
      <Paragraph style={{ marginBottom: 16, color: "var(--text-secondary)", maxWidth: 560 }}>
        Nếu bạn là <strong>Admin</strong>, hãy mở menu tài khoản (bấm vào tên/avatar góc phải trên) và chọn <strong>Vào Admin</strong> để mở trang quản trị trong tab mới — phiên đăng nhập hiện tại sẽ được dùng tự động.
      </Paragraph>
      <Paragraph style={{ color: "var(--text-secondary)", maxWidth: 560 }}>
        Bạn cũng có thể chọn <strong>Tổng quan</strong> trên menu bên trái để mở Admin trong tab mới.
      </Paragraph>
    </div>
  );
};

export default DashboardHome;

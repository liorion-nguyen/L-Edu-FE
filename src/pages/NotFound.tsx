import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, RADIUS, SPACING } from "../constants/colors";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Result
          status="404"
          title="404"
          subTitle="Trang bạn tìm kiếm không tồn tại"
          style={styles.result}
          extra={
            <Button
              type="primary"
              size="large"
              onClick={handleGoHome}
              style={styles.button}
            >
              Về trang chủ
            </Button>
          }
        />
      </div>
    </div>
  );
};

const styles: {
  container: React.CSSProperties;
  card: React.CSSProperties;
  result: React.CSSProperties;
  button: React.CSSProperties;
} = {
  container: {
    minHeight: "100vh",
    background: COLORS.background.secondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  card: {
    background: COLORS.background.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    border: `1px solid ${COLORS.border.light}`,
  },
  result: {
    padding: 0,
  },
  button: {
    background: COLORS.primary[500],
    borderColor: COLORS.primary[500],
    color: COLORS.text.inverse,
    height: "48px",
    fontSize: "16px",
    fontWeight: 500,
    borderRadius: RADIUS.md,
    padding: `0 ${SPACING.xl}`,
  },
};

export default NotFound;
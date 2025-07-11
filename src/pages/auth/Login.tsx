import { Divider, Typography, notification } from "antd";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import CustomInputHide from "../../components/common/CustomInputHide";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import { login } from "../../redux/slices/auth";
import { useDispatch } from "../../redux/store";
import { LoginValidationSchema } from "../../validations/authValidation";
import LoginMethods from "./components/LoginMethods";

const { Title, Text, Link } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await dispatch(login(values));
      if (response.payload) {
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
        });
        navigate("/");
      }
    } catch (error: any) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>
            Đăng nhập
          </Title>
          <Text style={styles.subtitle}>
            Chào mừng bạn trở lại L-Edu
          </Text>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginValidationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <CustomInput
                label="Email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
              />

              <CustomInputHide
                label="Mật khẩu"
                name="password"
                placeholder="Nhập mật khẩu"
              />

              <div style={styles.forgotPassword}>
                <Link href="/forgot-password" style={styles.link}>
                  Quên mật khẩu?
                </Link>
              </div>

              <div style={{ width: "100%", marginBottom: SPACING.lg }}>
                <CustomButton
                  type="submit"
                  label="Đăng nhập"
                  disabled={isLoading || isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>

        <Divider style={styles.divider}>Hoặc</Divider>

        <div style={styles.socialLogin}>
          <LoginMethods />
        </div>

        <div style={styles.registerLink}>
          <Text style={styles.text}>
            Chưa có tài khoản?{" "}
            <Link href="/signup" style={styles.link}>
              Đăng ký ngay
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

const styles: {
    [key: string]: React.CSSProperties;
} = {
    container: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    loginCard: {
        background: COLORS.background.primary,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.xl,
        padding: SPACING['2xl'],
        width: "100%",
        maxWidth: "400px",
    },
    header: {
        textAlign: "center",
        marginBottom: SPACING.xl,
    },
    title: {
        color: COLORS.text.heading,
        marginBottom: SPACING.sm,
        fontWeight: 600,
    },
    subtitle: {
        color: COLORS.text.secondary,
        fontSize: "16px",
    },
    forgotPassword: {
        textAlign: "right",
        marginBottom: SPACING.lg,
    },
    link: {
        color: COLORS.primary[500],
        fontWeight: 500,
        textDecoration: "none",
    },
    divider: {
        margin: `${SPACING.lg} 0`,
        borderColor: COLORS.border.light,
    },
    socialLogin: {
        marginBottom: SPACING.lg,
    },
    registerLink: {
        textAlign: "center",
        marginTop: SPACING.lg,
    },
    text: {
        color: COLORS.text.secondary,
        fontSize: "14px",
    },
};

export default Login;
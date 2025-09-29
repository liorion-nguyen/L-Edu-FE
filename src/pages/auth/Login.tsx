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
      if (response.payload != "Unauthorized") {
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
        });
        navigate("/");
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không chính xác",
        });
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
    <div style={styles.formContainer}>
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
          <Form style={styles.form}>
            <div style={styles.inputGroup}>
              <CustomInput
                label="Email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div style={styles.inputGroup}>
              <CustomInputHide
                label="Mật khẩu"
                name="password"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div style={styles.forgotPassword}>
              <Link href="/forgot-password" style={styles.link}>
                Quên mật khẩu?
              </Link>
            </div>

            <div style={styles.buttonContainer}>
              <CustomButton
                type="submit"
                label="Đăng nhập"
                disabled={isLoading || isSubmitting}
                loading={isLoading}
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
  );
};

const styles: {
    [key: string]: React.CSSProperties;
} = {
    formContainer: {
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        paddingBottom: SPACING.md,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
    },
    header: {
        textAlign: "center",
        marginBottom: SPACING.md,
    },
    title: {
        color: COLORS.text.heading,
        marginBottom: "4px",
        fontWeight: 700,
        fontSize: "22px",
        letterSpacing: "-0.025em",
    },
    subtitle: {
        color: COLORS.text.secondary,
        fontSize: "13px",
        fontWeight: 400,
    },
    form: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: "8px",
    },
    forgotPassword: {
        textAlign: "right",
        marginBottom: "12px",
    },
    link: {
        color: COLORS.primary[600],
        fontWeight: 500,
        textDecoration: "none",
        transition: "color 0.2s ease",
        fontSize: "14px",
    },
    buttonContainer: {
        width: "100%",
        marginBottom: "8px",
    },
    divider: {
        margin: "8px 0",
        borderColor: COLORS.border.light,
        color: COLORS.text.muted,
        fontSize: "14px",
        fontWeight: 500,
    },
    socialLogin: {
        marginBottom: "8px",
    },
    registerLink: {
        textAlign: "center",
        marginTop: "8px",
    },
    text: {
        color: COLORS.text.secondary,
        fontSize: "14px",
        fontWeight: 400,
    },
};

export default Login;
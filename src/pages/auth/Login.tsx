import { Divider, Typography, notification } from "antd";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import CustomInputHide from "../../components/common/CustomInputHide";
import { SPACING } from "../../constants/colors";
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
  const { t } = useTranslationWithRerender();

  const handleLogin = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await dispatch(login(values));
      console.log(response);
      if (response.payload === true) {
        notification.success({
          message: t('auth.messages.loginSuccess'),
          description: t('auth.messages.loginWelcome'),
        });
        navigate("/");
      } else {
        notification.error({
          message: t('auth.messages.loginFailed'),
          description: response.payload as string || "Email hoặc mật khẩu không chính xác",
        });
      }
    } catch (error: any) {
      notification.error({
        message: t('auth.messages.loginFailed'),
        description: error.message || t('common.error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.header}>
        <Title level={2} style={styles.title}>
          {t('auth.login.title')}
        </Title>
        <Text style={styles.subtitle}>
          {t('auth.login.subtitle')}
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
                label={t('auth.login.email')}
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div style={styles.inputGroup}>
              <CustomInputHide
                label={t('auth.login.password')}
                name="password"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div style={styles.forgotPassword}>
              <Link href="/forgot-password" style={styles.link}>
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <div style={styles.buttonContainer}>
              <CustomButton
                type="submit"
                label={t('auth.login.loginButton')}
                disabled={isLoading || isSubmitting}
                loading={isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>

      <Divider style={styles.divider}>{t('auth.login.or')}</Divider>

      <div style={styles.socialLogin}>
        <LoginMethods />
      </div>

      <div style={styles.registerLink}>
        <Text style={styles.text}>
          {t('auth.login.noAccount')}{" "}
          <Link href="/signup" style={styles.link}>
            {t('auth.login.signupLink')}
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
        color: "var(--text-primary)",
        marginBottom: "4px",
        fontWeight: 700,
        fontSize: "22px",
        letterSpacing: "-0.025em",
    },
    subtitle: {
        color: "var(--text-secondary)",
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
        color: "var(--accent-color)",
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
        borderColor: "var(--border-color)",
        color: "var(--text-tertiary)",
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
        color: "var(--text-secondary)",
        fontSize: "14px",
        fontWeight: 400,
    },
};

export default Login;
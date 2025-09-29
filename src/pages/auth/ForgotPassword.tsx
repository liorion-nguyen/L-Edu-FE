import { Typography, notification } from "antd";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import { COLORS, SPACING } from "../../constants/colors";
import * as Yup from 'yup';
import axios from "axios";

const { Title, Text, Link } = Typography;

interface ForgotPasswordFormData {
  email: string;
}

interface VerifyOTPFormData {
  email: string;
  code: string;
}

const ForgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
});

const VerifyOTPValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  code: Yup.string()
    .required('Mã OTP là bắt buộc')
    .length(6, 'Mã OTP phải có 6 ký tự'),
});

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (values: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await axios.post('/otp/forgot-password', values);
      setEmail(values.email);
      setStep('otp');
      notification.success({
        message: "Gửi OTP thành công",
        description: "Vui lòng kiểm tra email của bạn để lấy mã OTP",
      });
    } catch (error: any) {
      notification.error({
        message: "Gửi OTP thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (values: VerifyOTPFormData) => {
    setIsLoading(true);
    try {
      await axios.post('/otp/verify-otp', values);
      notification.success({
        message: "Xác thực thành công",
        description: "Mật khẩu mới đã được gửi về email của bạn",
      });
      navigate('/login');
    } catch (error: any) {
      notification.error({
        message: "Xác thực thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.header}>
        <Title level={2} style={styles.title}>
          Quên mật khẩu
        </Title>
        <Text style={styles.subtitle}>
          {step === 'email' 
            ? 'Nhập email của bạn để nhận mã OTP'
            : 'Nhập mã OTP đã được gửi đến email của bạn'
          }
        </Text>
      </div>

      {step === 'email' ? (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordValidationSchema}
          onSubmit={handleSendOTP}
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

              <div style={styles.buttonContainer}>
                <CustomButton
                  type="submit"
                  label="Gửi mã OTP"
                  disabled={isLoading || isSubmitting}
                  loading={isLoading}
                />
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ email, code: "" }}
          validationSchema={VerifyOTPValidationSchema}
          onSubmit={handleVerifyOTP}
        >
          {({ isSubmitting }) => (
            <Form style={styles.form}>
              <div style={styles.inputGroup}>
                <CustomInput
                  label="Mã OTP"
                  name="code"
                  placeholder="Nhập mã OTP"
                />
              </div>

              <div style={styles.buttonContainer}>
                <CustomButton
                  type="submit"
                  label="Xác nhận"
                  disabled={isLoading || isSubmitting}
                  loading={isLoading}
                />
              </div>

              <div style={styles.resendContainer}>
                <Text style={styles.text}>
                  Không nhận được mã?{" "}
                  <Link onClick={() => setStep('email')} style={styles.link}>
                    Gửi lại
                  </Link>
                </Text>
              </div>
            </Form>
          )}
        </Formik>
      )}

      <div style={styles.loginLink}>
        <Text style={styles.text}>
          Đã nhớ mật khẩu?{" "}
          <Link href="/login" style={styles.link}>
            Đăng nhập ngay
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
    marginBottom: "16px",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: "16px",
  },
  resendContainer: {
    textAlign: "center",
    marginBottom: "16px",
  },
  loginLink: {
    textAlign: "center",
    marginTop: "8px",
  },
  link: {
    color: COLORS.primary[600],
    fontWeight: 500,
    textDecoration: "none",
    transition: "color 0.2s ease",
    fontSize: "14px",
    cursor: "pointer",
  },
  text: {
    color: COLORS.text.secondary,
    fontSize: "14px",
    fontWeight: 400,
  },
};

export default ForgotPassword;

import { Typography, notification } from "antd";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import CustomButton from "../../components/common/CustomButton";
import CustomInputHide from "../../components/common/CustomInputHide";
import { COLORS, SPACING } from "../../constants/colors";
import * as Yup from 'yup';
import axios from "axios";

const { Title, Text } = Typography;

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Mật khẩu hiện tại là bắt buộc'),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .required('Mật khẩu mới là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (values: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await axios.post('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật",
      });
    } catch (error: any) {
      notification.error({
        message: "Đổi mật khẩu thất bại",
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
          Đổi mật khẩu
        </Title>
        <Text style={styles.subtitle}>
          Để bảo mật tài khoản, vui lòng nhập mật khẩu hiện tại và mật khẩu mới
        </Text>
      </div>

      <Formik
        initialValues={{ 
          currentPassword: "", 
          newPassword: "", 
          confirmPassword: "" 
        }}
        validationSchema={ChangePasswordValidationSchema}
        onSubmit={handleChangePassword}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <div style={styles.inputGroup}>
              <CustomInputHide
                label="Mật khẩu hiện tại"
                name="currentPassword"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div style={styles.inputGroup}>
              <CustomInputHide
                label="Mật khẩu mới"
                name="newPassword"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div style={styles.inputGroup}>
              <CustomInputHide
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div style={styles.buttonContainer}>
              <CustomButton
                type="submit"
                label="Đổi mật khẩu"
                disabled={isLoading || isSubmitting}
                loading={isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
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
};

export default ChangePassword;


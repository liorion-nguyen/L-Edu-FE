import { Typography, notification, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
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
  const navigate = useNavigate();
  const { t } = useTranslationWithRerender();

  const handleChangePassword = async (values: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await axios.post('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      notification.success({
        message: t('auth.messages.changePasswordSuccess'),
        description: t('auth.messages.passwordUpdated'),
      });
    } catch (error: any) {
      notification.error({
        message: t('auth.messages.changePasswordFailed'),
        description: error.response?.data?.message || t('common.error'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.backButton}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: COLORS.text.secondary 
          }}
        >
          {t('auth.changePassword.backButton')}
        </Button>
      </div>
      
      <div style={styles.header}>
        <Title level={2} style={styles.title}>
          {t('auth.changePassword.title')}
        </Title>
        <Text style={styles.subtitle}>
          {t('auth.changePassword.subtitle')}
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
                label={t('auth.changePassword.currentPassword')}
                name="currentPassword"
                placeholder={t('auth.changePassword.currentPasswordPlaceholder')}
              />
            </div>

            <div style={styles.inputGroup}>
              <CustomInputHide
                label={t('auth.changePassword.newPassword')}
                name="newPassword"
                placeholder={t('auth.changePassword.newPasswordPlaceholder')}
              />
            </div>

            <div style={styles.inputGroup}>
              <CustomInputHide
                label={t('auth.changePassword.confirmNewPassword')}
                name="confirmPassword"
                placeholder={t('auth.changePassword.confirmNewPasswordPlaceholder')}
              />
            </div>

            <div style={styles.buttonContainer}>
              <CustomButton
                type="submit"
                label={t('auth.changePassword.changePasswordButton')}
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
  backButton: {
    marginBottom: SPACING.sm,
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


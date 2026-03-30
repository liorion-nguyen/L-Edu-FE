import { ArrowLeftOutlined, ArrowRightOutlined, EyeInvisibleOutlined, LockOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import * as Yup from 'yup';
import axios from "axios";

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
    <div className="w-full">
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
        >
          <ArrowLeftOutlined />
          <span>{t('auth.changePassword.backButton')}</span>
        </button>
      </div>

      <div className="mb-7">
        <h2 className="mb-2 text-3xl font-bold leading-tight text-slate-50">
          {t('auth.changePassword.title')}
        </h2>
        <p className="text-slate-400">
          {t('auth.changePassword.subtitle')}
        </p>
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
          <Form className="w-full">
            <div className="mb-4">
              <label className="mb-2 inline-block text-sm font-medium text-slate-200">
                {t('auth.changePassword.currentPassword')}
              </label>
              <Field name="currentPassword">
                {({ field }: any) => (
                  <div className="relative">
                    <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                    <input
                      {...field}
                      type="password"
                      placeholder={t('auth.changePassword.currentPasswordPlaceholder')}
                      className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-11 text-sm text-slate-200 outline-none transition focus:border-primary"
                    />
                    <EyeInvisibleOutlined className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                  </div>
                )}
              </Field>
              <ErrorMessage name="currentPassword">
                {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-4">
              <label className="mb-2 inline-block text-sm font-medium text-slate-200">
                {t('auth.changePassword.newPassword')}
              </label>
              <Field name="newPassword">
                {({ field }: any) => (
                  <div className="relative">
                    <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                    <input
                      {...field}
                      type="password"
                      placeholder={t('auth.changePassword.newPasswordPlaceholder')}
                      className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-11 text-sm text-slate-200 outline-none transition focus:border-primary"
                    />
                    <EyeInvisibleOutlined className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                  </div>
                )}
              </Field>
              <ErrorMessage name="newPassword">
                {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-4">
              <label className="mb-2 inline-block text-sm font-medium text-slate-200">
                {t('auth.changePassword.confirmNewPassword')}
              </label>
              <Field name="confirmPassword">
                {({ field }: any) => (
                  <div className="relative">
                    <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                    <input
                      {...field}
                      type="password"
                      placeholder={t('auth.changePassword.confirmNewPasswordPlaceholder')}
                      className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-11 text-sm text-slate-200 outline-none transition focus:border-primary"
                    />
                    <EyeInvisibleOutlined className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                  </div>
                )}
              </Field>
              <ErrorMessage name="confirmPassword">
                {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
              </ErrorMessage>
            </div>

            <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="mb-2 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,127,255,0.2)] transition hover:bg-[#0b74df] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{t('auth.changePassword.changePasswordButton')}</span>
              <ArrowRightOutlined />
            </button>

            <div className="mt-8 text-center">
              <span className="text-sm text-slate-400">
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  {t("auth.login.title", "Đăng nhập")}
                </Link>
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;


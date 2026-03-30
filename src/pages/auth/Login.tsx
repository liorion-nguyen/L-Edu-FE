import {
  ArrowRightOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Checkbox, notification } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { login } from "../../redux/slices/auth";
import { useDispatch } from "../../redux/store";
import { LoginValidationSchema } from "../../validations/authValidation";
import LoginMethods from "./components/LoginMethods";

interface LoginFormData {
  email: string;
  password: string;
}

type Props = {
  /** Called when login succeeds (useful for modal embedding). */
  onLoginSuccess?: () => void;
  /**
   * Redirect after success. Default "/".
   * Set to null to disable navigation (e.g. modal login in dashboard).
   */
  redirectTo?: string | null;
};

const Login: React.FC<Props> = ({ onLoginSuccess, redirectTo = "/" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const submitLockRef = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslationWithRerender();

  const handleLogin = async (values: LoginFormData) => {
    if (submitLockRef.current) {
      return;
    }
    submitLockRef.current = true;
    setIsLoading(true);
    try {
      const response = await dispatch(login(values));
      console.log(response);
      if (response.payload === true) {
        notification.success({
          key: "auth-login-success",
          message: t('auth.messages.loginSuccess'),
          description: t('auth.messages.loginWelcome'),
        });
        onLoginSuccess?.();
        if (redirectTo !== null) {
          navigate(redirectTo);
        }
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
      submitLockRef.current = false;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-7">
        <h2 className="mb-2 text-3xl font-bold leading-tight text-slate-50">
          {t("auth.login.welcomeTitle", "Chào mừng trở lại")}
        </h2>
        <p className="text-slate-400">
          {t("auth.login.welcomeSubtitle", "Vui lòng đăng nhập để tiếp tục học tập")}
        </p>
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginValidationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="w-full">
            <div className="mb-4">
              <label className="mb-2 inline-block text-sm font-medium text-slate-200">
                {t("auth.login.email")}
              </label>
              <Field name="email">
                {({ field }: any) => (
                  <div className="relative">
                    <MailOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                    <input
                      {...field}
                      type="email"
                      placeholder="email@example.com"
                      className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-4 text-sm text-slate-200 outline-none transition focus:border-primary"
                    />
                  </div>
                )}
              </Field>
              <ErrorMessage name="email">
                {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-200">{t("auth.login.password")}</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
              <Field name="password">
                {({ field }: any) => (
                  <div className="relative">
                    <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                    <input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-11 text-sm text-slate-200 outline-none transition focus:border-primary"
                    />
                    <EyeInvisibleOutlined className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                  </div>
                )}
              </Field>
              <ErrorMessage name="password">
                {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-4">
              <Checkbox className="text-slate-400">{t("auth.login.rememberMe", "Ghi nhớ đăng nhập")}</Checkbox>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="mb-2 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,127,255,0.2)] transition hover:bg-[#0b74df] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{t("auth.login.loginButton")}</span>
              <ArrowRightOutlined />
            </button>
          </Form>
        )}
      </Formik>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-[rgba(148,163,184,0.28)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background-dark px-4 text-[13px] text-[#6b7f97]">{t("auth.login.or")}</span>
        </div>
      </div>

      <div className="mt-8">
        <LoginMethods />
      </div>

      <div className="mt-10 text-center">
        <span className="text-sm text-slate-400">
          {t("auth.login.noAccount")}{" "}
          <Link to="/signup" className="font-bold text-primary">
            {t("auth.login.signupLink")}
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
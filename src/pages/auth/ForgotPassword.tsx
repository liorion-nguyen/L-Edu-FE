import { ArrowRightOutlined, MailOutlined, SafetyOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import axios from "axios";

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
    <div className="w-full">
      <div className="mb-7">
        <h2 className="mb-2 text-3xl font-bold leading-tight text-slate-50">Quên mật khẩu</h2>
        <p className="text-slate-400">
          {step === 'email' 
            ? 'Nhập email của bạn để nhận mã OTP'
            : 'Nhập mã OTP đã được gửi đến email của bạn'
          }
        </p>
      </div>

      {step === 'email' ? (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordValidationSchema}
          onSubmit={handleSendOTP}
        >
          {({ isSubmitting }) => (
            <Form className="w-full">
              <div className="mb-4">
                <label className="mb-2 inline-block text-sm font-medium text-slate-200">Email</label>
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

              <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="mb-2 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,127,255,0.2)] transition hover:bg-[#0b74df] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{isLoading ? "Đang gửi..." : "Gửi mã OTP"}</span>
                <ArrowRightOutlined />
              </button>
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
            <Form className="w-full">
              <div className="mb-4">
                <label className="mb-2 inline-block text-sm font-medium text-slate-200">Mã OTP</label>
                <Field name="code">
                  {({ field }: any) => (
                    <div className="relative">
                      <SafetyOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                      <input
                        {...field}
                        placeholder="Nhập mã OTP"
                        className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-4 text-sm text-slate-200 outline-none transition focus:border-primary"
                      />
                    </div>
                  )}
                </Field>
                <ErrorMessage name="code">
                  {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
                </ErrorMessage>
              </div>

              <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="mb-2 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,127,255,0.2)] transition hover:bg-[#0b74df] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{isLoading ? "Đang xác thực..." : "Xác nhận"}</span>
                <ArrowRightOutlined />
              </button>

              <div className="mb-4 text-center">
                <span className="text-sm text-slate-400">
                  Không nhận được mã?{" "}
                  <button type="button" onClick={() => setStep('email')} className="font-semibold text-primary hover:underline">
                    Gửi lại
                  </button>
                </span>
              </div>
            </Form>
          )}
        </Formik>
      )}

      <div className="mt-10 text-center">
        <span className="text-sm text-slate-400">
          Đã nhớ mật khẩu?{" "}
          <Link to="/login" className="font-bold text-primary">
            Đăng nhập ngay
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ForgotPassword;


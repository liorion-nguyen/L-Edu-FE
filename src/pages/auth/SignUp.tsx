import {
    ArrowRightOutlined,
  EyeInvisibleOutlined,
    LockOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Checkbox } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useTranslationWithRerender } from "../../hooks/useLanguageChange";
import { register } from "../../redux/slices/auth";
import { useDispatch } from "../../redux/store";
import { SignUpValidationSchema } from "../../validations/authValidation";
import LoginMethods from "./components/LoginMethods";

interface SignUpValues {
    fullName: string;
    email: string;
    password: string;
    cfPassword: string;
    submit?: null;
}

const initialValues: SignUpValues = {
    fullName: "",
    email: "",
    password: "",
    cfPassword: "",
    submit: null,
};

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslationWithRerender();

    const handleSubmit = async (values: SignUpValues) => {
        const response = await dispatch(
            register({
                fullName: values.fullName,
                email: values.email,
                password: values.password,
            })
        );
        if (response.payload) {
            navigate("/login");
        }
    };

    return (
        <div className="w-full">
            <Helmet>
                <title>Sign Up | CodeLab</title>
            </Helmet>

            <div className="mb-7">
                <h1 className="mb-2 text-3xl font-bold leading-tight text-slate-50">
                    {t("auth.signup.pageTitle", "Đăng ký tài khoản")}
                </h1>
                <p className="text-slate-400">
                    {t("auth.signup.pageSubtitle", "Tạo tài khoản để bắt đầu học ngay hôm nay")}
                </p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={SignUpValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="w-full">
                        <div className="mb-4">
                            <label className="mb-2 inline-block text-sm font-medium text-slate-200">{t("auth.signup.fullName")}</label>
                            <Field name="fullName">
                                {({ field }: any) => (
                                    <div className="relative">
                                        <UserOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                                        <input
                                        {...field}
                                        placeholder="Nguyen Van A"
                                        className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-4 text-sm text-slate-200 outline-none transition focus:border-primary"
                                        />
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage name="fullName">
                                {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
                            </ErrorMessage>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 inline-block text-sm font-medium text-slate-200">{t("auth.signup.email")}</label>
                            <Field name="email">
                                {({ field }: any) => (
                                    <div className="relative">
                                        <MailOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                                        <input
                                        {...field}
                                        type="email"
                                        placeholder="example@gmail.com"
                                        className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-4 text-sm text-slate-200 outline-none transition focus:border-primary"
                                        />
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage name="email">
                                {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
                            </ErrorMessage>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="mb-4">
                                <label className="mb-2 inline-block text-sm font-medium text-slate-200">{t("auth.signup.password")}</label>
                                <Field name="password">
                                    {({ field }: any) => (
                                        <div className="relative">
                                            <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                                            <input
                                            {...field}
                                            placeholder="••••••••"
                                            type="password"
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
                                <label className="mb-2 inline-block text-sm font-medium text-slate-200">{t("auth.signup.confirmPassword")}</label>
                                <Field name="cfPassword">
                                    {({ field }: any) => (
                                        <div className="relative">
                                            <LockOutlined className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                                            <input
                                            {...field}
                                            placeholder="••••••••"
                                            type="password"
                                            className="h-[54px] w-full rounded-xl border border-[#25364d] bg-[rgba(18,30,48,0.9)] pl-11 pr-11 text-sm text-slate-200 outline-none transition focus:border-primary"
                                            />
                                            <EyeInvisibleOutlined className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="cfPassword">
                                    {(message) => <div className="mt-1.5 text-xs text-red-400">{message}</div>}
                                </ErrorMessage>
                            </div>
                        </div>

                        <div className="mb-4">
                            <Checkbox className="text-slate-400">
                                <span className="text-sm text-slate-400">
                                    {t("auth.signup.agreeTerms")}{" "}
                                    <button type="button" className="font-medium text-primary hover:underline">
                                        {t("auth.signup.termsLink", "Điều khoản")}
                                    </button>{" "}
                                    <span>{t("auth.signup.and", "và")}</span>{" "}
                                    <button type="button" className="font-medium text-primary hover:underline">
                                        {t("auth.signup.policyLink", "Chính sách")}
                                    </button>
                                </span>
                            </Checkbox>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mb-2 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,127,255,0.2)] transition hover:bg-[#0b74df] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <span>{t("auth.signup.signupButton")}</span>
                            <ArrowRightOutlined />
                        </button>

                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="h-px w-full bg-[rgba(148,163,184,0.28)]" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background-dark px-4 text-[13px] text-[#6b7f97]">
                                    {t("auth.signup.or")}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <LoginMethods />
                        </div>

                        <div className="mt-10 text-center">
                            <span className="text-sm text-slate-400">
                                {t("auth.signup.hasAccount")}{" "}
                                <Link to="/login" className="font-bold text-primary">
                                    {t("auth.signup.loginLink")}
                                </Link>
                            </span>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;
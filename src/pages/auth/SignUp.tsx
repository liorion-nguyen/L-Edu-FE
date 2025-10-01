import { Card, Checkbox, Divider, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import ButtonForm from "../../components/common/CustomButton";
import InputForm from "../../components/common/CustomInput";
import InputFormHide from "../../components/common/CustomInputHide";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";
import { register } from "../../redux/slices/auth";
import { useDispatch } from "../../redux/store";
import { SignUpValidationSchema } from "../../validations/authValidation";
import LoginMethods from "./components/LoginMethods";

const { Title, Text } = Typography;

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
        <div style={styles.formContainer}>
            <Helmet>
                <title>Sign Up | L-Edu</title>
            </Helmet>

            <div style={styles.header}>
                <Title level={1} style={styles.title}>
                    Đăng ký
                </Title>
                <Text style={styles.subtitle}>
                    Tạo tài khoản mới để bắt đầu học tập
                </Text>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={SignUpValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form style={styles.form}>
                        <div style={styles.inputGroup}>
                            <Field name="fullName">
                                {({ field }: any) => (
                                    <InputForm {...field} placeholder="Nhập họ và tên" />
                                )}
                            </Field>
                        </div>

                        <div style={styles.inputGroup}>
                            <Field name="email">
                                {({ field }: any) => (
                                    <InputForm {...field} placeholder="Nhập email" />
                                )}
                            </Field>
                        </div>

                        <div style={styles.inputGroup}>
                            <Field name="password">
                                {({ field }: any) => (
                                    <InputFormHide {...field} placeholder="Nhập mật khẩu" />
                                )}
                            </Field>
                        </div>

                        <div style={styles.inputGroup}>
                            <Field name="cfPassword">
                                {({ field }: any) => (
                                    <InputFormHide {...field} placeholder="Xác nhận mật khẩu" />
                                )}
                            </Field>
                        </div>

                        <div style={styles.checkboxContainer}>
                            <Checkbox style={styles.checkbox}>
                                <Text style={styles.checkboxLabel}>
                                    Tôi đồng ý với{" "}
                                    <Text style={styles.link}>
                                        điều khoản L-Edu
                                    </Text>
                                </Text>
                            </Checkbox>
                        </div>

                        <div style={styles.buttonContainer}>
                            <ButtonForm label="Đăng ký" type="submit" />
                        </div>

                        <Divider style={styles.divider}>Hoặc</Divider>

                        <div style={styles.socialLogin}>
                            <LoginMethods />
                        </div>

                        <div style={styles.loginLink}>
                            <Text style={styles.text}>
                                Đã có tài khoản?{" "}
                                <Text style={styles.link}>
                                    <a href="/login">Đăng nhập</a>
                                </Text>
                            </Text>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;

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
        textAlign: "center",
        marginBottom: "4px",
        fontWeight: 700,
        fontSize: "22px",
        letterSpacing: "-0.025em",
    },
    subtitle: {
        color: COLORS.text.secondary,
        fontSize: "13px",
        fontWeight: 400,
        textAlign: "center",
    },
    form: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: "8px",
    },
    checkboxContainer: {
        marginBottom: "12px",
    },
    checkbox: {
        margin: 0,
    },
    checkboxLabel: {
        color: COLORS.text.primary,
        fontSize: "14px",
        fontWeight: 400,
    },
    link: {
        color: COLORS.primary[600],
        fontWeight: 500,
        textDecoration: "none",
        transition: "color 0.2s ease",
    },
    buttonContainer: {
        width: "100%",
        marginBottom: "8px",
    },
    loginLink: {
        textAlign: "center",
        marginTop: "8px",
    },
    text: {
        color: COLORS.text.secondary,
        fontSize: "14px",
        fontWeight: 400,
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
};
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
        <div style={styles.container}>
            <Card style={styles.card}>
                <Helmet>
                    <title>Sign Up | L-Edu</title>
                </Helmet>

                <Title level={1} style={styles.title}>
                    Đăng ký
                </Title>

                <Formik
                    initialValues={initialValues}
                    validationSchema={SignUpValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Field name="fullName">
                                {({ field }: any) => (
                                    <InputForm {...field} placeholder="Nhập họ và tên" />
                                )}
                            </Field>

                            <Field name="email">
                                {({ field }: any) => (
                                    <InputForm {...field} placeholder="Nhập email" />
                                )}
                            </Field>

                            <Field name="password">
                                {({ field }: any) => (
                                    <InputFormHide {...field} placeholder="Nhập mật khẩu" />
                                )}
                            </Field>

                            <Field name="cfPassword">
                                {({ field }: any) => (
                                    <InputFormHide {...field} placeholder="Xác nhận mật khẩu" />
                                )}
                            </Field>

                            <Checkbox style={styles.checkbox}>
                                <Text style={styles.checkboxLabel}>
                                    Tôi đồng ý với{" "}
                                    <Text style={styles.link}>
                                        điều khoản L-Edu
                                    </Text>
                                </Text>
                            </Checkbox>

                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <ButtonForm label="Đăng ký" type="submit" />
                            </div>

                            <Divider style={styles.divider}>Hoặc</Divider>

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
            </Card>
        </div>
    );
};

export default SignUp;

const styles: {
    [key: string]: React.CSSProperties;
} = {
    container: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    card: {
        background: COLORS.background.primary,
        border: `1px solid ${COLORS.border.light}`,
        borderRadius: RADIUS.xl,
        padding: SPACING['2xl'],
        width: "100%",
        maxWidth: "400px"
    },
    title: {
        color: COLORS.text.heading,
        textAlign: "center",
        marginBottom: SPACING.lg,
        fontWeight: 600,
    },
    checkbox: {
        margin: `0 0 ${SPACING.lg} 0`,
    },
    checkboxLabel: {
        color: COLORS.text.primary,
    },
    link: {
        color: COLORS.primary[500],
        fontWeight: 500,
    },
    loginLink: {
        textAlign: "center",
        marginTop: SPACING.lg,
    },
    text: {
        color: COLORS.text.secondary,
        fontSize: "14px",
    },
    divider: {
        margin: `${SPACING.lg} 0`,
        borderColor: COLORS.border.light,
    },
};
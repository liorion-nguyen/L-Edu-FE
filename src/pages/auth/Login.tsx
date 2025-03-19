import { Button, Card, Divider, Space, Typography } from "antd";
import { Formik, Form, Field, useFormik } from "formik";
import LoginMethods from "./components/LoginMethods";
import InputForm from "../../components/common/CustomInput";
import ButtonForm from "../../components/common/CustomButton";
import { LoginValidationSchema } from "../../validations/authValidation";
import { Helmet } from "react-helmet-async";
import { dispatch, RootState, useSelector } from "../../redux/store";
import { getUser, login } from "../../redux/slices/auth";
import InputFormHide from "../../components/common/CustomInputHide";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FacebookOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface LoginValues {
    email: string;
    password: string;
    submit: null;
}

const initialValues: LoginValues = {
    email: '',
    password: '',
    submit: null,
};

const { Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues,
        validationSchema: LoginValidationSchema,
        onSubmit: (values) => {
        }
    });

    const handleSubmit = async (values: LoginValues) => {
        const checkLogin = await dispatch(login({ email: values.email, password: values.password }));
        if (checkLogin) {
            navigate('/');
        }
    };

    const { user } = useSelector((state: RootState) => state.auth);
    return (
        <Card style={{ background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
            borderRadius: 16,
            padding: 20,
            transition: "box-shadow 0.3s, transform 0.3s",
            margin: "0 auto", }}>
            <Helmet>
                <title>Login | L-Edu</title>
            </Helmet>

            <Title level={1} style={{ textAlign: "center" }}>Login</Title>

            <Formik
                initialValues={initialValues}
                validationSchema={LoginValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Field name="email">
                            {({ field }: any) => (
                                <div>
                                    <InputForm {...field} placeholder="Enter your email" />
                                </div>
                            )}
                        </Field>

                        <Field name="password">
                            {({ field }: any) => (
                                <div>
                                    <InputFormHide {...field} placeholder="Enter your password" />
                                </div>
                            )}
                        </Field>

                        <div style={styles.forgotPassword}>
                            <Text style={styles.link}>
                                <a href="#">Forgot password?</a>
                            </Text>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <ButtonForm label="Login" type="submit" />
                        </div>

                        <Divider style={styles.divider}>Or</Divider>

                        {/* Social Login Buttons */}
                        <Space direction="horizontal" size="middle" style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                icon={<FacebookOutlined />}
                                style={styles.socialButton}
                                shape="circle"
                            />
                            <Button
                                icon={<GithubOutlined />}
                                style={styles.socialButton}
                                shape="circle"
                            />
                            <Button
                                icon={<GoogleOutlined />}
                                style={styles.socialButton}
                                shape="circle"
                            />
                        </Space>

                        <div style={styles.registerLink}>
                            <Text style={styles.text}>
                                Don't have an account?{" "}
                                <Text style={styles.link}>
                                    <a href="./signup">Register</a>
                                </Text>
                            </Text>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default Login;

const styles:{
    [key: string]: React.CSSProperties;
} = {
    input: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        color: "#B0E0E6", // Pale teal for text
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        marginBottom: 20,
    },
    forgotPassword: {
        textAlign: "right",
        margin: "10px 0",
    },
    link: {
        color: "#4ECDC4", // Brighter teal for links
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    },
    divider: {
        background: "linear-gradient(90deg, transparent, #4ECDC4, transparent)", // Teal gradient for divider
        boxShadow: "0 0 15px rgba(78, 205, 196, 0.5)", // Glowing teal shadow
        margin: "20px 0",
    },
    socialButton: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        color: "#B0E0E6", // Pale teal for icons
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        transition: "box-shadow 0.3s",
    },
    registerLink: {
        textAlign: "center",
        marginTop: 20,
    },
    text: {
        color: "#B0E0E6", // Pale teal for text
    },
}
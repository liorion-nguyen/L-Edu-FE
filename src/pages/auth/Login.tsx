import { Card, Divider, Typography } from "antd";
import { Formik, Form, Field } from "formik";
import LoginMethods from "./components/LoginMethods";
import InputForm from "../../components/common/CustomInput";
import { loginValidationSchema } from "../../validations/authValidation";
import ButtonForm from "../../components/common/CustomButton";
import { Helmet } from "react-helmet-async";

const { Title } = Typography;

const Login = () => {
    const handleSubmit = (values: any) => {
        console.log("Success:", values);
    };

    return (
        <Card style={{ boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)", borderRadius: "10px" }}>
            <Helmet>
                <title>Login | L-Edu</title>
            </Helmet>

            <Title level={1} style={{ textAlign: "center" }}>Login</Title>

            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={loginValidationSchema}
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
                                    <InputForm {...field} placeholder="Enter your password" />
                                </div>
                            )}
                        </Field>

                        <div style={{ textAlign: "right", margin: "10px 0" }}>
                            <a href="#">Forgot password?</a>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <ButtonForm label="Login" type="submit" />
                        </div>

                        <Divider />

                        <LoginMethods />
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            Don't have an account? <a href="./signup">Register</a>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default Login;
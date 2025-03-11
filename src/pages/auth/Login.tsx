import { Card, Divider, Typography } from "antd";
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

const Login = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues,
        validationSchema: LoginValidationSchema,
        onSubmit: (values) => {
        }
    });

    const handleSubmit = async(values: LoginValues) => {
        const checkLogin = await dispatch(login({ email: values.email, password: values.password }));
        if (checkLogin) {
            navigate('/');
        }
    };

    const { user } = useSelector((state: RootState) => state.auth);
    return (
        <Card style={{ boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)", borderRadius: "10px" }}>
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
import { Card, Checkbox, CheckboxProps, Divider, Typography } from "antd";
import { Formik, Form, Field } from "formik";
import InputForm from "../../components/common/CustomInput";
import { SignUpValidationSchema } from "../../validations/authValidation";
import ButtonForm from "../../components/common/CustomButton";
import { Helmet } from "react-helmet-async";
import { dispatch } from "../../redux/store";
import { register } from "../../redux/slices/auth";
import InputFormHide from "../../components/common/CustomInputHide";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface SignUpValues {
    fullName: string;
    email: string;
    password: string;
    cfPassword: string; 
    submit?: null;
}

const initialValues: SignUpValues = {
    fullName: '',
    email: '',
    password: '',
    cfPassword: '', 
    submit: null,
};

const SignUp = () => {
    const navigate = useNavigate();
    const handleSubmit = async (values: SignUpValues) => {
        const check = await dispatch(register({ 
            fullName: values.fullName, 
            email: values.email, 
            password: values.password 
        }));
        if (check) {
            navigate('/login');
        }
    };

    return (
        <Card style={{ boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)", borderRadius: "10px" }}>
            <Helmet>
                <title>Sign Up | L-Edu</title>
            </Helmet>

            <Title level={1} style={{ textAlign: "center" }}>Sign Up</Title>

            <Formik
                initialValues={initialValues}
                validationSchema={SignUpValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Field name="fullName">
                            {({ field }: any) => (
                                <InputForm {...field} placeholder="Enter your full name" />
                            )}
                        </Field>

                        <Field name="email">
                            {({ field }: any) => (
                                <InputForm {...field} placeholder="Enter your email" />
                            )}
                        </Field>

                        <Field name="password">
                            {({ field }: any) => (
                                <InputFormHide {...field} placeholder="Enter your password" />
                            )}
                        </Field>

                        <Field name="cfPassword">
                            {({ field }: any) => (
                                <InputFormHide {...field} placeholder="Confirm your password" />
                            )}
                        </Field>

                        <Checkbox style={{ margin: "0 0 30px 0" }}>
                            Agree to terms <b style={{ color: "#1890ff" }}>L-Edu</b>
                        </Checkbox>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <ButtonForm label="Sign Up" type="submit" />
                        </div>

                        <Divider />

                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            Already have an account? <a href="/login">Sign in</a>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default SignUp;
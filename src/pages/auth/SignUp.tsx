import { Card, Checkbox, CheckboxProps, Divider, Typography } from "antd";
import { Formik, Form, Field } from "formik";
import InputForm from "../../components/common/CustomInput";
import { signUpValidationSchema } from "../../validations/authValidation";
import ButtonForm from "../../components/common/CustomButton";
import { Helmet } from "react-helmet-async";

const { Title } = Typography;

const SignUp = () => {
    const handleSubmit = (values: any) => {
        console.log("Success:", values);
    };

    const onChange: CheckboxProps['onChange'] = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };

    return (
        <Card style={{ boxShadow: "0px 4px 8px rgba(38, 38, 38, 0.2)", borderRadius: "10px" }}>
            <Helmet>
                <title>Sign Up | L-Edu</title>
            </Helmet>

            <Title level={1} style={{ textAlign: "center" }}>Sign Up</Title>

            <Formik
                initialValues={{ fullname: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={signUpValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Field name="fullname">
                            {({ field }: any) => (
                                <div>
                                    <InputForm {...field} placeholder="Enter your fullName" />
                                </div>
                            )}
                        </Field>

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

                        <Field name="confirmPassword">
                            {({ field }: any) => (
                                <div>
                                    <InputForm {...field} placeholder="Enter your confirmPassword" />
                                </div>
                            )}
                        </Field>


                        <Checkbox onChange={onChange} style={{ margin: "0 0 30px 0" }}>Agree to terms <b style={{ color: "#1890ff" }}>L-Edu</b></Checkbox>

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
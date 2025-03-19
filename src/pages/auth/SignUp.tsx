import { Card, Checkbox, Divider, Typography } from "antd";
import { Formik, Form, Field } from "formik";
import { SignUpValidationSchema } from "../../validations/authValidation";
import { Helmet } from "react-helmet-async";
import { dispatch } from "../../redux/store";
import { register } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";
import InputForm from "../../components/common/CustomInput";
import InputFormHide from "../../components/common/CustomInputHide";
import ButtonForm from "../../components/common/CustomButton";

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

    const handleSubmit = async (values: SignUpValues) => {
        const check = await dispatch(
            register({
                fullName: values.fullName,
                email: values.email,
                password: values.password,
            })
        );
        if (check) {
            navigate("/login");
        }
    };

    return (
        <Card style={styles.card}>
            <Helmet>
                <title>Sign Up | L-Edu</title>
            </Helmet>

            <Title level={1} style={styles.title}>
                Sign Up
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

                        <Checkbox style={styles.checkbox}>
                            <Text style={styles.checkboxLabel}>
                                Agree to terms{" "}
                                <Text style={styles.link}>
                                    L-Edu
                                </Text>
                            </Text>
                        </Checkbox>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <ButtonForm label="Sign Up" type="submit" />
                        </div>

                        <Divider style={styles.divider}></Divider>

                        <div style={styles.loginLink}>
                            <Text style={styles.text}>
                                Already have an account?{" "}
                                <Text style={styles.link}>
                                    <a href="/login">Sign in</a>
                                </Text>
                            </Text>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default SignUp;

const styles: {
    [key: string]: React.CSSProperties;
} = {
    card: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        borderRadius: 16,
        padding: 20,
        transition: "box-shadow 0.3s, transform 0.3s",
        margin: "0 auto",
    },
    title: {
        color: "#B0E0E6", // Pale teal for text
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        background: "rgba(78, 205, 196, 0.05)", // Teal undertone for glassmorphism
        border: "1px solid rgba(78, 205, 196, 0.2)", // Teal border
        color: "#B0E0E6", // Pale teal for text
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        marginBottom: 20,
    },
    checkbox: {
        margin: "0 0 30px 0",
        color: "#B0E0E6", // Pale teal for checkbox
    },
    checkboxLabel: {
        color: "#B0E0E6", // Pale teal for text
    },
    link: {
        color: "#4ECDC4", // Brighter teal for links
        textShadow: "0 0 5px rgba(78, 205, 196, 0.3)", // Subtle teal glow
    },
    button: {
        background: "linear-gradient(45deg, #4ECDC4, #1A4A4A)", // Teal gradient
        border: "none",
        color: "#B0E0E6", // Pale teal for text
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(78, 205, 196, 0.2)", // Teal glow
        transition: "box-shadow 0.3s",
        width: "100%",
    },
    loginLink: {
        textAlign: "center",
        marginTop: 20,
    },
    text: {
        color: "#B0E0E6", // Pale teal for text
    },
    divider: {
        background: "linear-gradient(90deg, transparent, #4ECDC4, transparent)", // Teal gradient for divider
        boxShadow: "0 0 15px rgba(78, 205, 196, 0.5)", // Glowing teal shadow
        margin: "20px 0",
    },
};

// Add hover effects and animations using CSS
const styleSheetSignUp = document.createElement("style");
styleSheetSignUp.innerText = `
  .ant-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
    transform: translateY(-5px);
  }
  .signup-button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6), 0 0 15px rgba(78, 205, 196, 0.4);
  }
  .divider::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.7), transparent);
    animation: glow 3s infinite;
  }
  @keyframes glow {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: -100%;
    }
  }
`;
document.head.appendChild(styleSheetSignUp);
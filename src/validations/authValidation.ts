import * as Yup from "yup";

export const LoginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .trim()
        .email("Invalid email")
        .required("Please enter your email"),
    password: Yup.string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .required("Please enter your password"),
});

export const SignUpValidationSchema = Yup.object().shape({
    fullName: Yup.string()
        .trim()
        .min(3, "Fullname must be at least 3 characters")
        .required("Please enter your fullname"),
    email: Yup.string()
        .trim()
        .email("Invalid email")
        .required("Please enter your email"),
    password: Yup.string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .required("Please enter your password"),
    cfPassword: Yup.string()
        .trim()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    agree: Yup.boolean()
        .oneOf([true], "Please agree to the terms and conditions"),
});
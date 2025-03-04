import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Please enter your email"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Please enter your password")
});

export const signUpValidationSchema = Yup.object().shape({
    fullname: Yup.string()
        .min(3, "Fullname must be at least 3 characters")
        .required("Please enter your fullname"),
    email: Yup.string()
        .email("Invalid email")
        .required("Please enter your email"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Please enter your password"),
    confirmPassword: Yup.string()   
        .required("Please enter your password"),
});
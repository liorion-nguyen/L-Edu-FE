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

export const UpdateUserValidationSchema = Yup.object({
    email: Yup.string()
        .email("Must be a valid email")
        .max(255, "Email must be at most 255 characters")
        .required("Email is required"),
    fullName: Yup.string()
        .max(255, "Full name must be at most 255 characters")
        .required("Full name is required"),
    password: Yup.string()
        .min(7, "Password must be at least 7 characters")
        .max(255, "Password must be at most 255 characters")
        .required("Password is required"),
    confirmPassword: Yup.string().required("Confirm password is required"),
    policy: Yup.boolean().oneOf([true], "This field must be checked"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    address: Yup.object({
        province: Yup.string().required("Province is required"),
        district: Yup.string().required("District is required"),
        ward: Yup.string().required("Ward is required"),
    }),
    phone: Yup.object({
        country: Yup.string().required("Country code is required"),
        number: Yup.string()
            .max(9, "Number phone must be at most 9 characters")
            .matches(/^\d{8,11}$/, "Phone number must be between 8 and 11 digits")
            .required("Phone number is required"),
    }),
});
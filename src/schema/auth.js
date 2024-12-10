import * as Yup from "yup";

export const validateLoginSchema = Yup.object().shape({
    username: Yup.string()
        .required("Username is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const validateRegisterSchema = Yup.object().shape({
    username: Yup.string()
        .required("Username is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    termsOfService: Yup.boolean()
        .required("The terms and conditions must be accepted.")
        .oneOf([true], "The terms and conditions must be accepted.")
});

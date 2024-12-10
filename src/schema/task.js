import * as Yup from "yup";

export const validateTaskSchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required"),
});

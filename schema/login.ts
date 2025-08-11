import * as Yup from "yup"

export const LoginSchema = Yup.object().shape({
  userId: Yup.string().required("User ID is required").min(3, "User ID must be at least 3 characters"),
  school_code: Yup.string().required("School code is required").min(2, "School code must be at least 2 characters"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
})

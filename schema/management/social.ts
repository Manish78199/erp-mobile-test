import * as Yup from "yup"

export const CreatePostSchema = Yup.object().shape({
  title: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
  platform: Yup.string().required("Platform is required"),
  content: Yup.string().min(10, "Content must be at least 10 characters").required("Content is required"),
  scheduledDate: Yup.date()
    .min(new Date(), "Scheduled date must be in the future")
    .required("Scheduled date is required"),
})

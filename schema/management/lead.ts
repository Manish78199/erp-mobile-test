import * as Yup from "yup"

export const CreateLeadSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string().min(10, "Phone number must be at least 10 digits").required("Phone is required"),
  source: Yup.string().required("Source is required"),
  campaign: Yup.string(),
  score: Yup.number().min(0, "Score must be between 0 and 100").max(100, "Score must be between 0 and 100"),
  notes: Yup.string(),
})

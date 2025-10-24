import * as Yup from "yup"

export const CreateRuleSchema = Yup.object().shape({
  name: Yup.string().min(3, "Rule name must be at least 3 characters").required("Rule name is required"),
  trigger: Yup.string().required("Trigger is required"),
  action: Yup.string().required("Action is required"),
  description: Yup.string(),
})

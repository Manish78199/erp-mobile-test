import * as Yup from "yup"

export const CreateCampaignSchema = Yup.object().shape({
  name: Yup.string().min(3, "Campaign name must be at least 3 characters").required("Campaign name is required"),
  channel: Yup.string().required("Channel is required"),
  objective: Yup.string().required("Objective is required"),
  budget: Yup.number().min(1, "Budget must be greater than 0").required("Budget is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().min(Yup.ref("startDate"), "End date must be after start date").required("End date is required"),
  description: Yup.string(),
})

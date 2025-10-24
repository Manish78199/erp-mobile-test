import * as yup from 'yup';

const SubjectSchema = yup.object().shape({
  class_id: yup.string().required("Class  is required"),
  name: yup.string().required("Subject name is required"),
  code: yup.string().required("Subject code is required"),
  subject_type: yup
    .mixed()
    .oneOf(["THEORETICAL", "PRACTICAL","BOTH"], "Invalid subject type")
    .required("Subject type is required"),
  result_type: yup
    .mixed()
    .oneOf(["GRADE", "PERCENTAGE", "GPA", "CGPA"], "Invalid result type")
    .required("Result type is required"),
});

export default SubjectSchema;
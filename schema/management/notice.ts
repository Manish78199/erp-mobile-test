import * as yup from 'yup';

const NoticeSchema = yup.object().shape({
    title: yup.string().required("Please provide title."),
    message: yup.string().required("Please provide message."),
    audience_type: yup.mixed().oneOf(["ALL", "CLASS", "STUDENT"], "Invalid subject type").required("Subject type is required"),
    class_ids: yup.array().of(yup.string()).nullable(),
    student_ids:yup.array().of(yup.string()).nullable()
});

export { NoticeSchema };
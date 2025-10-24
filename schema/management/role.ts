import * as yup from 'yup';

const RoleSchema = yup.object().shape({
    name: yup.string().required("Please provide name."),
    description: yup.string().required("Please provide description ."),
    permissions: yup.array().of(yup.object({module:yup.string(),action:yup.string()})).nullable()
 
});

export { RoleSchema };
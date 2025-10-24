import * as yup from 'yup';

const NoticeSchema = yup.object().shape({
    class_id: yup.string().required("Please provide title."),
    components: yup.array(yup.object({
        
    })).required("Please provide message."),
    
});

export { NoticeSchema };
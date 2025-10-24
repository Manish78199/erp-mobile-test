import * as Yup from 'yup';



const New_HomeWork = Yup.object({

    class_id: Yup.string().required("Please select a valid class ."),
    section: Yup.string().optional(),
    subject: Yup.string().required("Please select a subject ."),
    title: Yup.string().min(3).required("Please enter a valid title ."),
    description: Yup.string().min(3).required("Please enter a valid description ."),
    assigned_date: Yup.date().required("Please select a valid assign date ."),
    due_date: Yup.date().required("Please select a valid due date ."),
})



export {
    New_HomeWork
}
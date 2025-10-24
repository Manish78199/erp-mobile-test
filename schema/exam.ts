import * as yup from 'yup';


const ExamSchema = yup.object().shape({
    name: yup.string().required("Please enter a valid exam name "),
    duration: yup.number().required("Please enter  valid exam duration ").min(1, "Exam duration must be greater than 0"),
    class_id: yup.string().required("Please choose a valid class"),
    subjects: yup.array(yup.object().shape({
        subject_id: yup.string(),
        max_practical: yup.number().nullable(),
        min_practical: yup.number().nullable(),
        max_theory: yup.number().nullable(),
        min_theory: yup.number().nullable(),
        schedule_at: yup.date().nullable(),
        practical_at: yup.date().nullable()
    }))
})


const ResultSettingSchema = yup.object().shape({
    result_score_type: yup.string().required("Please choose a valid score type").oneOf(["GRADE", "PERCENTAGE", "CGPA", "GPA"]),
    grade_scale: yup.array(yup.object().shape({
        grade: yup.string().required("Please enter a grade name "),
        min_percentage: yup.number().min(1).max(100),
        max_percentage: yup.number().min(1).max(100),
        remark: yup.string().required("Please enter a valid remark")
    })
    ),

    division_scale: yup.array(yup.object().shape({
        division: yup.string().required("Please enter a division name "),
        min_percentage: yup.number().min(1).max(100),
        max_percentage: yup.number().min(1).max(100),
    })

    ),
    overall_passing_percentage: yup.number().min(1).max(100),


})

export {
    ExamSchema,
    ResultSettingSchema
}
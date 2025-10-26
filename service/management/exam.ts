import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";


const createExam = async (examDetails: any) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.EXAM.create,
        examDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
        }
    );
}

const get_all_exam = async (class_id: string | null = null) => {
    let route = class_id ? `${ApiRoute.EXAM.get_all}?class_id=${class_id}` : ApiRoute.EXAM.get_all

    const access_token = await get_access_token()
    try {
        const exams = await axios.get(route,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
            }
        );
        return exams.data.data
    } catch (error) {
        return []
    }
}



const get_clas_exam_for_attendance = async (class_id: string) => {
    let route = `${ApiRoute.EXAM.get_class_exam}/${class_id}`

    const access_token = await get_access_token()
    try {
        const exams = await axios.get(route,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
            }
        );
        return exams.data.data
    } catch (error) {
        return []
    }
}

const get_exam_student_attendance_by_subject = async (examSubjectId: string) => {
    let route = `${ApiRoute.EXAM.get_exam_student_and_subject}/${examSubjectId}`

    const access_token = await get_access_token()

    const examDetails = await axios.get(route,

        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
        }
    );
    return examDetails

}



const mark_exam_attendance = async (attendanceDetails: any) => {
    const access_token = await get_access_token()

    return await axios.post(ApiRoute.EXAM.mark_apprear,
        attendanceDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
        }
    );
}


export {
    createExam,
    get_all_exam,
    get_clas_exam_for_attendance,
    get_exam_student_attendance_by_subject,
    mark_exam_attendance
}
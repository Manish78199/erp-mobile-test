
import axios from "axios";
import routes from "@/config/route"

import StudentRegistrationSchema from "@/schema/admission"

const createAdmission = async (admissionDetials: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.studentService.addmission,
        admissionDetials,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}

const getAdmissionDetails = async (studentId: string) => {
    const access_token = localStorage.getItem("access_token")
    try {
        const response = await axios.get(`${routes.studentService.get_admission_student_details}/${studentId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return null
    }

}


const getAllSchoolStudent = async () => {
    const access_token = localStorage.getItem("access_token")
    try {
        const response = await axios.get(routes.studentService.getAllSchoolStudent,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return []
    }
}
const getClassStudents = async (classId: string) => {
    const access_token = localStorage.getItem("access_token")
    try {
        const response = await axios.get(`${routes.studentService.getByClass}/${classId}`,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return []
    }
}

const getStudentForAttendance = async (class_id: string, date?: string) => {

    const access_token = localStorage.getItem("access_token")
    try {
        const response = await axios.get(`${routes.studentService.getStudentForAttendance}/${class_id}?attendanceDate=${date}`,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return []
    }
}



const markStudentAttendance = async (data: {
    "student_id": string,
    "status": string,
    "date": string
}[]) => {

    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.studentAttendance.mark,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


const getStudentProfileById = async (student_id: string) => {
    const access_token = localStorage.getItem("access_token")
    try {
        const response = await axios.get(`${routes.studentService.getStudentProfile}?student_id=${student_id}`,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return null
    }
}


const changeStudentProfileImage = async (student_id: string, image: File) => {
    const formData = new FormData()
    formData.append("image", image)
    const access_token = localStorage.getItem("access_token")

    const response = await axios.post(`${routes.studentService.changeStudentProfileimage}?student_id=${student_id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
    return response

}



export {
    createAdmission,
    getAdmissionDetails,
    getAllSchoolStudent,
    getStudentForAttendance,
    markStudentAttendance,
    getStudentProfileById,
    changeStudentProfileImage,
    getClassStudents
}
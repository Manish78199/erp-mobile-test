import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const getAllExam = async () => {
    const access_token=await get_access_token()
    try {
        const exams = await axios.get(`${ApiRoute.STUDENT.exam.get_all}`,
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



const get_latest_exam_schedule = async () => {
    const access_token=await get_access_token()
    try {
        const exams = await axios.get(`${ApiRoute.STUDENT.exam.schedule}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return exams.data.data
    } catch (error) {
        return null
    }
}



const get_result = async (exam_id:string) => {
    const access_token=await get_access_token()
    try {
        const exams = await axios.get(`${ApiRoute.STUDENT.exam.result}/${exam_id}`,
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


export {
    get_latest_exam_schedule, get_result, getAllExam
};


import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const get_sessional_exams = async () => {
    const access_token=await get_access_token()
    try {
        const allClass = await axios.get(`${ApiRoute.STUDENT.RESULT.get_sessional_exams}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return allClass.data.data
    } catch (error) {
        return []
    }
}


const get_exam_result = async (examId:string) => {
    const access_token=await get_access_token()
    try {
        const allClass = await axios.get(`${ApiRoute.STUDENT.RESULT.get_exam_result}/${examId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return allClass.data.data
    } catch (error) {
        return null
    }
}



export {
    get_exam_result, get_sessional_exams
};

